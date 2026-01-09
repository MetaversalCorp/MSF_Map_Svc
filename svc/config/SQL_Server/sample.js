/*
** Copyright 2025 Metaversal Corporation.
** 
** Licensed under the Apache License, Version 2.0 (the "License"); 
** you may not use this file except in compliance with the License. 
** You may obtain a copy of the License at 
** 
**    https://www.apache.org/licenses/LICENSE-2.0
** 
** Unless required by applicable law or agreed to in writing, software 
** distributed under the License is distributed on an "AS IS" BASIS, 
** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
** See the License for the specific language governing permissions and 
** limitations under the License.
** 
** SPDX-License-Identifier: Apache-2.0
*/

const fs            = require ('fs');
const path          = require ('path');
const sql           = require ('mssql/msnodesqlv8');

const Settings      = require ('./settings.json');

/*******************************************************************************************************************************
**                                                     Main                                                                   **
*******************************************************************************************************************************/

class MVSF_Map_Sample
{
   constructor ()
   {
      this.#ReadFromEnv (Settings.SQL.config, [ "connectionString" ]);
      this.#ReadFromEnv (Settings.SQL.install, [ "db_name", "login_name", "pathname" ]);
   }

   Install ()
   {
      const sSrcPath = path.join (__dirname, '..', 'sample');
      const sDstPath = path.join (__dirname, 'web');

      fs.cp (sSrcPath, sDstPath, { recursive: true }, (err) => {
         if (err)
            console.error ('Error copying folder:', err);
         else
         {
            console.log ('Sample Files copied');
            this.Run ();
         }
      });
   }

   async Run ()
   {
      console.log ('Sample Install...');
         
      let bResult = await this.#ExecSQL ([['[{MSF_Map}]', Settings.SQL.install.db_name], ['{Login_Name}', Settings.SQL.install.login_name], ['{Pathname}', Settings.SQL.install.pathname]]);

      if (bResult)
         console.log ('Sample SUCCESS!!');
      else
         console.log ('Sample FAILURE!!');
   }

   #GetToken (sToken)
   {
      let sResult;

      if (typeof sToken == "string")
      {
         const match = sToken.match (/<([^>]+)>/);
         sResult = match ? match[1] : null;
      }
      else sResult = null;

      return sResult;
   }

   #ReadFromEnv (Config, aFields)
   {
      let sValue;

      for (let i=0; i < aFields.length; i++)
      {
         if ((sValue = this.#GetToken (Config[aFields[i]])) != null)
            Config[aFields[i]] = process.env[sValue];
      }
   }

   #EscapeRegExp (sToken)
   {
      return sToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   }

   async #ExecSQL (asToken)
   {
      let bResult = false;
      const pConfig = { ...Settings.SQL.config };
      let aRegex = [];
      
      console.log ('Sample STARTING ...');
     
      try 
      {
         for (let i=0; i < asToken.length; i++)
         {
            aRegex.push (new RegExp (this.#EscapeRegExp (asToken[i][0]), "g"));
         }            

         // Create connection
         await sql.connect (pConfig);

         let stmt = "DECLARE @nResult INT; EXEC @nResult = dbo.set_RMRoot_RMPObject_Open '0.0.0.0', 1, 1, 'My First Scene', 1, 0, 1, 0, 1, 0, '', '', 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 150, 150, 150; SELECT @nResult AS nResult"; 

         let results = await sql.query (stmt);

         if (results.recordsets[results.recordsets.length - 1][0].nResult == 0)
         {
            stmt = "DECLARE @nResult INT; EXEC @nResult = dbo.set_RMPObject_RMPObject_Open '0.0.0.0', 1, " + results.recordsets[0][0].twRMPObjectIx + ", 'Hello World!', 1, 0, 1, 0, 1, 0, '', '/objects/capsule.glb', 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 134.65382385253906, 13.596150933846705, 129.60743890149325; SELECT @nResult AS nResult";

            results = await sql.query (stmt);

            if (results.recordsets[results.recordsets.length - 1][0].nResult == 0)
            {
               bResult = true;
            }
            else
               console.log ('Sample FAILED to create object');
         }
         else
            console.log ('Sample FAILED to create scene');

         await sql.close ();
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      }

      return bResult;
   }
}

const g_pSample = new MVSF_Map_Sample ();
g_pSample.Install ();

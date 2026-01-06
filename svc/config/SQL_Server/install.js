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

class MVSF_Map_Install
{
   constructor ()
   {
      this.#ReadFromEnv (Settings.SQL.config, [ "connectionString" ]);
      this.#ReadFromEnv (Settings.SQL.install, [ "db_name", "login_name" ]);
   }

   async Run ()
   {
      let bResult = await this.#IsDBInstalled ();

      if (bResult == false)
      {
         console.log ('Installion Starting...');
         
//         this.#ProcessFabricConfig ();

         console.log ('Creating Database...');
         bResult = await this.#ExecSQL ('MSF_Map.sql', true, [['[{MSF_Map}]', Settings.SQL.install.db_name], ['{Login_Name}', Settings.SQL.install.login_name]]);

         if (bResult)
            console.log ('Installation SUCCESS!!');
         else
            console.log ('Installation FAILURE!!');
      }
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

   async #ExecSQL (sFilename, bCreate, asToken, sTSQL)
   {
      let bResult = false;
      const pConfig = { ...Settings.SQL.config };
      let aRegex = [];
      
      if (bCreate)
         pConfig.connectionString = pConfig.connectionString.replace (/Database=[^;]*;/i, "");  // Remove database from config to connect without it

      console.log ('Installing (' + sFilename + ')...');
     
      try 
      {
         if (sFilename)
         {
            const sSQLFile = path.join (__dirname, sFilename);
            sTSQL = fs.readFileSync (sSQLFile, 'utf8');
         }

         for (let i=0; i < asToken.length; i++)
         {
            aRegex.push (new RegExp (this.#EscapeRegExp (asToken[i][0]), "g"));
         }            

         const statements = sTSQL.split(/^\s*GO\s*$/im);

         // Create connection
         await sql.connect (pConfig);

         for (let stmt of statements)
         {
            if (stmt.trim ())
            {
               for (let i=0; i < aRegex.length; i++)
               {
                  stmt = stmt.replace (aRegex[i], asToken[i][1]);
               }

               await sql.query (stmt);
            }
         }

         await sql.close ();

         console.log ('Successfully installed (' + sFilename + ')');

         bResult = true;
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      }

      return bResult;
   }

   async #IsDBInstalled ()
   {
      const pConfig = { ...Settings.SQL.config };
      let bResult = false;
      const match = pConfig.connectionString.match(/Database=([^;]+)/i);

      if (match)
      {
         const sDB = match[1];

         pConfig.connectionString = pConfig.connectionString.replace (/Database=[^;]*;/i, "");  // Remove database from config to connect without it
         try 
         {
            // Create connection
            await sql.connect (pConfig);

            // Check if database exists
            const result = await sql.query `SELECT 1 FROM sys.databases WHERE name= ${sDB}`

            if (result.recordsets[0].length > 0)
            {
               console.log ('Database is already installed.');
               bResult = true;
            }
            else console.log ('Database does not exist.');

            await sql.close ();
         } 
         catch (err) 
         {
            console.error ('Error executing SQL:', err.message);
         } 
      }
      else console.error ('Failed to provide a Database name in the connection string');
      
      return bResult;
   }
}

const g_pInstall = new MVSF_Map_Install ();
g_pInstall.Run ();

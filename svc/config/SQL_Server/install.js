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
   }

   async Run ()
   {
      let bResult = await this.#IsDBInstalled ();

      if (bResult == false)
      {
         console.log ('Starting Installation...');
         
//         this.#ProcessFabricConfig ();

         bResult = await this.#ExecSQL ('MSF_Map.sql', true);

         if (bResult)
            console.log ('Installation successfully completed...');
      }
      else console.log ('DB Exists aborting installation...');
   }

   #GetToken (sToken)
   {
      const match = sToken.match (/<([^>]+)>/);
      return match ? match[1] : null;
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

   async #ExecSQL (sFilename, bCreate)
   {
      const sSQLFile = path.join (__dirname, sFilename);
      const pConfig = { ...Settings.SQL.config };
      let pConn;
      
      if (bCreate)
         pConfig.connectionString = pConfig.connectionString.replace (/Database=[^;]*;/i, "");  // Remove database from config to connect without it

      console.log ('Installing (' + sFilename + ')...');
     
      try 
      {
         // Create connection
         pConn = await sql.connect (pConfig.connectionString);

         // Read SQL file asynchronously
         const sSQLContent = fs.readFileSync (sSQLFile, 'utf8');
         let i, j, x, d, a, aStmt = sSQLContent.split ('DELIMITER');

         for (i=0; i<aStmt.length; i++)
         {
            if (i > 0)
            {
               x = aStmt[i].indexOf ('\n', 0) + 1;
               d = aStmt[i].slice (0, x).trim ();

               aStmt[i] = aStmt[i].slice (x);
            }
            else d = ';';

            if (d == ';')
            {
               a = [];
               a[0] = aStmt[i];
            }
            else a = aStmt[i].split (d);

            // Execute SQL

            for (j=0; j<a.length; j++)
               if (a[j].trim () != '')       // optional
                  await pConn.request ().query (a[j]);
         }

         await sql.close ();

         console.log ('Successfully installed (' + sFilename + ')');      
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      }
   }

   async #IsDBInstalled ()
   {
      const pConfig = { ...Settings.SQL.config };
      let pConn;
      let bResult = false;
      let match = pConfig.connectionString.match (/database=([^;]+)/i);

      pConfig.connectionString = pConfig.connectionString.replace (/Database=[^;]*;/i, "");  // Remove database from config to connect without it
      try 
      {
         // Create connection
         pConn = await sql.connect (pConfig.connectionString);

         // Check if database exists
         const [aRows] = await pConn.request ().query (
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
            [sDB]
         );

         if (aRows.length !== 0)
         {
            bResult = true;
         }

         await sql.close ();
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      } 
      
      return bResult;
   }
}

const g_pInstall = new MVSF_Map_Install ();
g_pInstall.Run ();

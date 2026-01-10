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
const mysql         = require ('mysql2/promise');

const Settings      = require ('./settings.json');

/*******************************************************************************************************************************
**                                                     Main                                                                   **
*******************************************************************************************************************************/

class MVSF_Map_Install
{
   constructor ()
   {
      this.#ReadFromEnv (Settings.SQL.config, [ "host", "port", "user", "password", "database" ]);
      this.#ReadFromEnv (Settings.MVSF,   [ "nPort", "key", "sCompanyId" ]);
   }

   async Run ()
   {
      let bResult = await this.#IsDBInstalled ();

      if (bResult == false)
      {
         console.log ('Starting Installation...');
         
         bResult = await this.#ExecSQL ('MSF_Map.sql', true, [['[{MSF_Map}]', Settings.SQL.config.database]] );

         if (bResult)
         {
            bResult = await this.#ExecSQL2 ([['[{MSF_Map}]', Settings.SQL.config.database]] );

            if (bResult)
               console.log ('Installation successfully completed...');
            else
               console.log ('Sample FAILURE!!');
         }
      }
      else console.log ('DB Exists aborting installation...');

      console.log ('Running Config Scripts...');
      this.Install ('sample', '', false);
      this.Install ('objects', 'objects', true);
   }

   Install (sSrcFolder, sDstFolder, bNext)
   {
      const sSrcPath = path.join (__dirname, '..', sSrcFolder);
      const sDstPath = path.join (__dirname, 'web/' + sDstFolder);

      if (fs.existsSync (sSrcPath))
      {
         fs.cp (sSrcPath, sDstPath, { recursive: true }, (err) => {
            if (err)
               console.error ('Error copying folder:', err);
            else
            {
               console.log ('Folder: (' + sSrcFolder + ') created');

               if (bNext)
                  this.#ProcessFabricConfig ();
            }
         });
      }
   }

   async #ExecSQL2 (asToken)
   {
      let bResult = false;
      const pConfig = { ...Settings.SQL.config };
      let pConn;
      let aRegex = [];
      
      console.log ('Sample STARTING ...');
     
      try 
      {
         for (let i=0; i < asToken.length; i++)
         {
            aRegex.push (new RegExp (this.#EscapeRegExp (asToken[i][0]), "g"));
         }            

         // Create connection
         pConn = await mysql.createConnection (pConfig);

         let stmt = "CALL set_RMRoot_RMPObject_Open ('0.0.0.0', 1, 1, 'My First Scene', 1, 0, 1, 0, 1, 0, '', '', 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 150, 150, 150, @nResult); SELECT @nResult AS nResult;";

         let results = await pConn.query (stmt);

         if (results[0][results[0].length - 1][0].nResult == 0)
         {
            stmt = "CALL set_RMPObject_RMPObject_Open ('0.0.0.0', 1, " + results[0][0][0].twRMPObjectIx + ", 'Hello World!', 1, 0, 1, 0, 1, 0, '', '/objects/capsule.glb', 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 134.65382385253906, 13.596150933846705, 129.60743890149325, @nResult); SELECT @nResult AS nResult;";

            results = await pConn.query (stmt);

            if (results[0][results[0].length - 1][0].nResult == 0)
            {
               bResult = true;
            }
            else
               console.log ('Sample FAILED to create object');
         }
         else
            console.log ('Sample FAILED to create scene');
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      } 
      finally 
      {
         if (pConn) 
         {
            await pConn.end ();
         }
      }

      return bResult;
   }

   #ProcessFabricConfig ()
   {
      const sFabricPath = path.join (__dirname, 'web', 'fabric');

      try
      {
         let sContent = fs.readFileSync (path.join (sFabricPath, 'sample.msf'), 'utf8');

         // Replace all occurrences of <PUBLIC_DOMAIN> with the actual environment variable
         // Check for PUBLIC_DOMAIN first, fallback to RAILWAY_PUBLIC_DOMAIN for Railway compatibility
         const sPublicDomain = process.env.PUBLIC_DOMAIN || process.env.RAILWAY_PUBLIC_DOMAIN || '';
         sContent = sContent.replace (/<PUBLIC_DOMAIN>/g, sPublicDomain);
         sContent = sContent.replace (/<MY_COMPANY_ID>/g, Settings.MVSF.sCompanyId);

         fs.writeFileSync (path.join (sFabricPath, 'fabric.msf'), sContent, 'utf8');
      }
      catch (err)
      {
         console.log ('Error processing sample.msf: ', err);
      }
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

   #EscapeRegExp (sToken)
   {
      return sToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   }

   async #ExecSQL (sFilename, bCreate, asToken)
   {
      let bResult = false;
      const sSQLFile = path.join (__dirname, sFilename);
      const pConfig = { ...Settings.SQL.config };
      let pConn;
      let aRegex = [];
      
      if (bCreate)
         delete pConfig.database; // Remove database from config to connect without it

      console.log ('Installing (' + sFilename + ')...');
     
      try 
      {
         for (let i=0; i < asToken.length; i++)
         {
            aRegex.push (new RegExp (this.#EscapeRegExp (asToken[i][0]), "g"));
         }            

         // Create connection
         pConn = await mysql.createConnection (pConfig);

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
               {
                  let stmt = a[j];
                  for (let i=0; i < aRegex.length; i++)
                  {
                     stmt = stmt.replace (aRegex[i], asToken[i][1]);
                  }

                  await pConn.query (stmt);
               }
         }

         bResult = true;
         console.log ('Successfully installed (' + sFilename + ')');      
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      } 
      finally 
      {
         if (pConn) 
         {
            await pConn.end ();
         }
      }

      return bResult;
   }

   async #IsDBInstalled ()
   {
      const pConfig = { ...Settings.SQL.config };
      let pConn;
      let bResult = false;
      let sDB = pConfig.database;

      delete pConfig.database; // Remove database from config to connect without it
      try 
      {
         // Create connection
         pConn = await mysql.createConnection (pConfig);

         // Check if database exists
         const [aRows] = await pConn.execute (
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
            [sDB]
         );

         if (aRows.length !== 0)
         {
            bResult = true;
         }
      } 
      catch (err) 
      {
         console.error ('Error executing SQL:', err.message);
      } 
      finally 
      {
         if (pConn) 
         {
            await pConn.end ();
         }
      }

      return bResult;
   }
}

const g_pInstall = new MVSF_Map_Install ();
g_pInstall.Run ();

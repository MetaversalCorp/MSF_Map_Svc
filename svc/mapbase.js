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

const { MVSF           } = require ('@metaversalcorp/mvsf');
const { InitSQL        } = require ('./utils.js');

const fs    = require ('fs');
const path  = require ('path');

/*******************************************************************************************************************************
**                                          CLASS (AuthSimple)                                                                **
*******************************************************************************************************************************/

class AuthSimple
{
   #pSettings;

   constructor (pSettings)
   {
      this.#pSettings = pSettings;
   }

   Exec (bREST, sAction, pConn, Session, pData, fnRSP, fn)
   {
      if (sAction == 'login')
         this.#Login (Session, pData, fnRSP, fn);
      else if (sAction == 'logout')
         this.#Logout (Session, pData, fnRSP, fn);
      else
         fnRSP (fn, { nResult: -1 });
   }

   #Login (Session, pData, fnRSP, fn)
   {
      let pResult = { nResult: -1 };
      
      if (pData && pData.acToken64U_RP1 == this.#pSettings.MVSF.key)
      {
         pResult.nResult           = 0;
         pResult.sSessionToken     = this.#pSettings.MVSF.key;

         Session.twRPersonaIx      = 1;
      }

      fnRSP (fn, pResult);
   }

   #Logout (Session, pData, fnRSP, fn)
   {
      Session.twRPersonaIx     = 0;
      
      fnRSP (fn, { nResult: 0 });
   }
}

/*******************************************************************************************************************************
**                                          CLASS (AuthSimple)                                                                **
*******************************************************************************************************************************/

class MVSF_MapBase
{
   #pServer;
   #pSettings;
   #sObjectPath;

   constructor (asConfigFields, pSettings)
   {
      this.#pSettings = pSettings;

      this.ReadFromEnv (this.#pSettings.SQL.config, asConfigFields);

      this.#sObjectPath = path.join (__dirname, './web/objects');
   }

   onSQLReady (pMVSQL, err)
   {
      if (pMVSQL)
      {
         this.ReadFromEnv (this.#pSettings.MVSF, [ "internal_port", "external_port", "key" ]);

         this.#pServer = new MVSF (this.#pSettings.MVSF, require ('./handler.json'), __dirname, new AuthSimple (this.#pSettings), 'application/json');
         const pApp = this.#pServer.LoadHtmlSite (__dirname, [ './web' ]);
         pApp.get ('/objects.json', (req, res) => {
            let data = [];
            
            const items = fs.readdirSync (this.#sObjectPath, { withFileTypes: true });

            items
               .filter (item => item.isFile())
               .forEach (file => data.push (file.name));

            // Set headers for download
            res.setHeader ('Content-Type', 'application/json');
//            res.setHeader ('Content-Disposition', 'attachment; filename="objects.json"');

            // Send JSON as file
            res.send (JSON.stringify (data, null, 2));
         });
         
         this.#pServer.Run ();

         console.log ('SQL Server READY');
         InitSQL (pMVSQL, this.#pServer, this.#pSettings.Info);
      }
      else
      {
         console.log ('SQL Server Connect Error: ', err);
      }
   }

   ReadFromEnv (Config, aFields)
   {
      let sValue;

      for (let i=0; i < aFields.length; i++)
      {
         if ((sValue = this.#GetToken (Config[aFields[i]])) != null)
            Config[aFields[i]] = process.env[sValue];
      }
   }

   #GetToken (sToken)
   {
      const match = sToken.match (/<([^>]+)>/);
      return match ? match[1] : null;
   }
}

module.exports =
{
   MVSF_MapBase
}

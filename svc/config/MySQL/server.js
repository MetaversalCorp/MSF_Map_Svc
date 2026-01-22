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

const { MVSF_MapBase  } = require ('./mapbase.js');
const Settings          = require ('./settings.json');

const { MVSQL_MYSQL  } = require ('@metaversalcorp/mvsql_mysql');

/*******************************************************************************************************************************
**                                                     Main                                                                   **
*******************************************************************************************************************************/

class MVSF_Map extends MVSF_MapBase
{
   #pSQL;

   constructor ()
   {
      super ([ "host", "port", "user", "password", "database" ], Settings);

      switch (Settings.SQL.type)
      {
      case 'MYSQL':         this.#pSQL = new MVSQL_MYSQL (Settings.SQL.config, this.onSQLReady.bind (this)); break;

      default:
         console.log ('No Database was configured for this service.');
         break;
      }
   }
}

const g_pServer = new MVSF_Map ();

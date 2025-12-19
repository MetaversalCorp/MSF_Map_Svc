
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { MVHANDLER } = require ('@metaversalcorp/mvsf');
const { GetInfo, RunQuery, RunQuery2 } = require ('../utils.js');

class HndlrRMPObject extends MVHANDLER
{
   constructor ()
   {
      super 
      (
         'rmpobject', 
         {
            'update': {
               SqlData: {
                  sProc: 'get_RMPObject',
                  aData: [ 'twRMPObjectIx' ],
                  Param: 0
               }
            }
         },
         RunQuery,
         {
            'RMPObject:update': {
               SqlData: {
                  sProc: 'get_RMPObject_Update',
                  aData: [ 'twRMPObjectIx' ],
                  Param: 0
               }
            },
            "RMPObject:info": {
               sCB: "Info"
            },

            'RMPObject:bound': {
               SqlData: {
                  sProc: 'set_RMPObject_Bound',
                  aData: [ 'twRMPObjectIx',
                           'Bound_dX', 'Bound_dY', 'Bound_dZ' 
                  ],
                  Param: 1
               }
            },

            'RMPObject:name': {
               SqlData: {
                  sProc: 'set_RMPObject_Name',
                  aData: [ 'twRMPObjectIx', 'Name_wsRMPObjectId' ],
                  Param: 1
               }
            },

            'RMPObject:owner': {
               SqlData: {
                  sProc: 'set_RMPObject_Owner',
                  aData: [ 'twRMPObjectIx', 
                           'Owner_twRPersonaIx' 
                  ],
                  Param: 1
               }
            },

            'RMPObject:resource': {
               SqlData: {
                  sProc: 'set_RMPObject_Resource',
                  aData: [ 'twRMPObjectIx',
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                  ],
                  Param: 1
               }
            },

            'RMPObject:rmpobject_close': {
               SqlData: {
                  sProc: 'set_RMPObject_RMPObject_Close',
                  aData: [ 'twRMPObjectIx',
                           'twRMPObjectIx_Close', 'bDeleteAll' 
                  ],
                  Param: 1
               }
            },

            'RMPObject:rmpobject_open': {
               SqlData: {
                  sProc: 'set_RMPObject_RMPObject_Open',
                  aData: [ 'twRMPObjectIx',
                           'Name_wsRMPObjectId',
                           'Type_bType', 'Type_bSubtype', 'Type_bFiction', 'Type_bMovable',
                           'Owner_twRPersonaIx', 
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ',      
                           'Bound_dX', 'Bound_dY', 'Bound_dZ'
                  ],
                  Param: 1
               }
            },

            'RMPObject:parent': {
               SqlData: {
                  sProc: 'set_RMPObject_Parent',
                  aData: [ 'twRMPObjectIx',
                           'wClass', 'twObjectIx' 
                  ],
                  Param: 1
               }
            },

            'RMPObject:transform': {
               SqlData: {
                  sProc: 'set_RMPObject_Transform',
                  aData: [ 'twRMPObjectIx',
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ'
                  ],
                  Param: 1
               }
            },

            'RMPObject:type': {
               SqlData: {
                  sProc: 'set_RMPObject_Type',
                  aData: [ 'twRMPObjectIx',
                           'Type_bType', 'Type_bSubtype', 'Type_bFiction', 'Type_bMovable'
                  ],
                  Param: 1
               }
            }
         },
         RunQuery2
      );
   }
   
   Info (pConn, Session, pData, fnRSP, fn)
   {
      GetInfo (pData.sType, pData.twRMPObjectIx, fnRSP, fn);
   }
}

/*******************************************************************************************************************************
**                                                     Initialization                                                         **
*******************************************************************************************************************************/

module.exports = HndlrRMPObject;

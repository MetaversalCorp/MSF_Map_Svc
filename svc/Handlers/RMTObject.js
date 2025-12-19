
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

/*******************************************************************************************************************************
**                                                     Class                                                                  **
*******************************************************************************************************************************/

class HndlrRMTObject extends MVHANDLER
{
   constructor ()
   {
      super 
      (
         'rmtobject', 
         {
            'update': {
               SqlData: {
                  sProc: 'get_RMTObject',
                  aData: [ 'twRMTObjectIx' ],
                  Param: 0
               }
            },
            'search': {
               SqlData: {
                  sProc: 'search_RMTObject',
                  aData: [ 'twRMTObjectIx', 'dX', 'dY', 'dZ', 'sText' ],
                  Param: 1
               }
            }
         },
         RunQuery,
         {
            'RMTObject:update': {
               SqlData: {
                  sProc: 'get_RMTObject_Update',
                  aData: [ 'twRMTObjectIx' ],
                  Param: 0
               }
            },
            'RMTObject:search': {
               SqlData: {
                  sProc: 'search_RMTObject',
                  aData: [ 'twRMTObjectIx', 'dX', 'dY', 'dZ', 'sText' ],
                  Param: 1
               }
            },
            "RMTObject:info": {
               sCB: "Info"
            },

            'RMTObject:bound': {
               SqlData: {
                  sProc: 'set_RMTObject_Bound',
                  aData: [ 'twRMTObjectIx',
                           'Bound_dX', 'Bound_dY', 'Bound_dZ' 
                  ],
                  Param: 1
               }
            },

            'RMTObject:name': {
               SqlData: {
                  sProc: 'set_RMTObject_Name',
                  aData: [ 'twRMTObjectIx', 
                           'Name_wsRMTObjectId' 
                  ],
                  Param: 1
               }
            },

            'RMTObject:owner': {
               SqlData: {
                  sProc: 'set_RMTObject_Owner',
                  aData: [ 'twRMTObjectIx', 
                           'Owner_twRPersonaIx' 
                  ],
                  Param: 1
               }
            },

            'RMTObject:properties': {
               SqlData: {
                  sProc: 'set_RMTObject_Properties',
                  aData: [ 'twRMTObjectIx',
                           'Properties_bLockToGround', 'Properties_bYouth', 'Properties_bAdult', 'Properties_bAvatar'
                  ],
                  Param: 1
               }
            },

            'RMTObject:resource': {
               SqlData: {
                  sProc: 'set_RMTObject_Resource',
                  aData: [ 'twRMTObjectIx',
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                  ],
                  Param: 1
               }
            },

            'RMTObject:rmpobject_close': {
               SqlData: {
                  sProc: 'set_RMTObject_RMPObject_Close',
                  aData: [ 'twRMTObjectIx',
                           'twRMPObjectIx_Close', 'bDeleteAll' 
                  ],
                  Param: 1
               }
            },

            'RMTObject:rmpobject_open': {
               SqlData: {
                  sProc: 'set_RMTObject_RMPObject_Open',
                  aData: [ 'twRMTObjectIx',
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

            'RMTObject:rmtobject_close': {
               SqlData: {
                  sProc: 'set_RMTObject_RMTObject_Close',
                  aData: [ 'twRMTObjectIx',
                           'twRMTObjectIx_Close', 'bDeleteAll' 
                  ],
                  Param: 1
               }
            },

            'RMTObject:rmtobject_open': {
               SqlData: {
                  sProc: 'set_RMTObject_RMTObject_Open',
                  aData: [ 'twRMTObjectIx',
                           'Type_bType', 'Type_bSubtype', 'Type_bFiction',
                           'Owner_twRPersonaIx', 
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ',      
                           'Bound_dX', 'Bound_dY', 'Bound_dZ',
                           'Properties_bLockToGround', 'Properties_bYouth', 'Properties_bAdult', 'Properties_bAvatar',
                           'bCoord', 'dA', 'dB', 'dC'
                  ],
                  Param: 1
               }
            },

            'RMTObject:transform': {
               SqlData: {
                  sProc: 'set_RMTObject_Transform',
                  aData: [ 'twRMTObjectIx',
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ',
                           'bCoord', 'dA', 'dB', 'dC'
                  ],
                  Param: 1
               }
            },

            'RMTObject:type': {
               SqlData: {
                  sProc: 'set_RMTObject_Type',
                  aData: [ 'twRMTObjectIx',
                           'Type_bType', 'Type_bSubtype', 'Type_bFiction'
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
      GetInfo (pData.sType, pData.twRMTObjectIx, fnRSP, fn);
   }
}

/*******************************************************************************************************************************
**                                                     Initialization                                                         **
*******************************************************************************************************************************/

module.exports = HndlrRMTObject;

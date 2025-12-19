
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

class HndlrRMCObject extends MVHANDLER
{
   constructor ()
   {
      super 
      (
         'rmcobject', 
         {
            'update': {
               SqlData: {
                  sProc: 'get_RMCObject',
                  aData: [ 'twRMCObjectIx' ],
                  Param: 0
               }
            },
            'search': {
               SqlData: {
                  sProc: 'search_RMCObject',
                  aData: [ 'twRMCObjectIx', 'dX', 'dY', 'dZ', 'sText' ],
                  Param: 1
               }
            }
         },
         RunQuery,
         {
            'RMCObject:update': {
               SqlData: {
                  sProc: 'get_RMCObject_Update',
                  aData: [ 'twRMCObjectIx' ],
                  Param: 0
               }
            },
            'RMCObject:search': {
               SqlData: {
                  sProc: 'search_RMCObject',
                  aData: [ 'twRMCObjectIx', 'dX', 'dY', 'dZ', 'sText' ],
                  Param: 1
               }
            },

            "RMCObject:info": {
               sCB: "Info"
            },

            'RMCObject:bound': {
               SqlData: {
                  sProc: 'set_RMCObject_Bound',
                  aData: [ 'twRMCObjectIx', 'Bound_dX', 'Bound_dY', 'Bound_dZ' ],
                  Param: 1
               }
            },

            'RMCObject:name': {
               SqlData: {
                  sProc: 'set_RMCObject_Name',
                  aData: [ 'twRMCObjectIx', 'Name_wsRMCObjectId' ],
                  Param: 1
               }
            },

            'RMCObject:orbit': {
               SqlData: {
                  sProc: 'set_RMCObject_Orbit',
                  aData: [ 'twRMCObjectIx',
                           'Orbit_Spin_tmPeriod', 'Orbit_Spin_tmStart', 'Orbit_Spin_dA', 'Orbit_Spin_dB'
                  ],
                  Param: 1
               }
            },

            'RMCObject:owner': {
               SqlData: {
                  sProc: 'set_RMCObject_Owner',
                  aData: [ 'twRMCObjectIx', 'Owner_twRPersonaIx' ],
                  Param: 1
               }
            },

            'RMCObject:properties': {
               SqlData: {
                  sProc: 'set_RMCObject_Properties',
                  aData: [ 'twRMCObjectIx',
                           'Properties_fMass', 'Properties_fGravity', 'Properties_fColor', 'Properties_fBrightness',  'Properties_fReflectivity' 
                  ],
                  Param: 1
               }
            },

            'RMCObject:resource': {
               SqlData: {
                  sProc: 'set_RMCObject_Resource',
                  aData: [ 'twRMCObjectIx',
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                  ],
                  Param: 1
               }
            },

            'RMCObject:rmcobject_close': {
               SqlData: {
                  sProc: 'set_RMCObject_RMCObject_Close',
                  aData: [ 'twRMCObjectIx',
                           'twRMCObjectIx_Close', 'bDeleteAll' 
                  ],
                  Param: 1
               }
            },

            'RMCObject:rmcobject_open': {
               SqlData: {
                  sProc: 'set_RMCObject_RMCObject_Open',
                  aData: [ 'twRMCObjectIx',
                           'Name_wsRMCObjectId', 
                           'Type_bType', 'Type_bSubtype', 'Type_bFiction', 
                           'Owner_twRPersonaIx', 
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ',      
                           'Orbit_Spin_tmPeriod', 'Orbit_Spin_tmStart', 'Orbit_Spin_dA', 'Orbit_Spin_dB', 
                           'Bound_dX', 'Bound_dY', 'Bound_dZ', 
                           'Properties_fMass', 'Properties_fGravity', 'Properties_fColor', 'Properties_fBrightness',  'Properties_fReflectivity' 
                  ],
                  Param: 1
               }
            },

            'RMCObject:rmtobject_close': {
               SqlData: {
                  sProc: 'set_RMCObject_RMTObject_Close',
                  aData: [ 'twRMCObjectIx',
                           'twRMTObjectIx_Close', 'bDeleteAll' 
                  ],
                  Param: 1
               }
            },

            'RMCObject:rmtobject_open': {
               SqlData: {
                  sProc: 'set_RMCObject_RMTObject_Open',
                  aData: [ 'twRMCObjectIx',
                           'Name_wsRMTObjectId', 
                           'Type_bType', 'Type_bSubtype', 'Type_bFiction',
                           'Owner_twRPersonaIx', 
                           'Resource_qwResource', 'Resource_sName', 'Resource_sReference', 
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ',      
                           'Bound_dX', 'Bound_dY', 'Bound_dZ',
                           'Properties_bLockToGround', 'Properties_bYouth', 'Properties_bAdult', 'Properties_bAvatar'
                  ],
                  Param: 1
               }
            },

            'RMCObject:transform': {
               SqlData: {
                  sProc: 'set_RMCObject_Transform',
                  aData: [ 'twRMCObjectIx',
                           'Transform_Position_dX', 'Transform_Position_dY', 'Transform_Position_dZ', 'Transform_Rotation_dX', 'Transform_Rotation_dY', 'Transform_Rotation_dZ', 'Transform_Rotation_dW', 'Transform_Scale_dX', 'Transform_Scale_dY', 'Transform_Scale_dZ'
                  ],
                  Param: 1
               }
            },

            'RMCObject:type': {
               SqlData: {
                  sProc: 'set_RMCObject_Type',
                  aData: [ 'twRMCObjectIx',
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
      GetInfo (pData.sType, pData.twRMCObjectIx, fnRSP, fn);
   }
}

/*******************************************************************************************************************************
**                                                     Initialization                                                         **
*******************************************************************************************************************************/

module.exports = HndlrRMCObject;

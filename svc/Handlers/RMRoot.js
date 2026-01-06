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

const { MVHANDLER } = require ('@metaversalcorp/mvsf');
const { RunQuery, RunQuery2 } = require ('../utils.js');

/*******************************************************************************************************************************
**                                                     Class                                                                  **
*******************************************************************************************************************************/

class HndlrRMRoot extends MVHANDLER
{
   constructor ()
   {
      super 
      (
         'rmroot', 
         {
            'update': {
               SqlData: {
                  sProc: 'get_RMRoot',
                  aData: [ 'twRMRootIx' ],
                  Param: 0
               }
            }
         },
         RunQuery,
         {
            'RMRoot:update': {
               SqlData: {
                  sProc: 'get_RMRoot_Update',
                  aData: [ 'twRMRootIx' ],
                  Param: 0
               }
            },

            'RMRoot:name': {
               SqlData: {
                  sProc: 'set_RMRoot_Name',
                  aData: [ 'twRMRootIx', 'Name_wsRMRootId' ],
                  Param: 1
               }
            },

            'RMRoot:owner': {
               SqlData: {
                  sProc: 'set_RMRoot_Owner',
                  aData: [ 'twRMRootIx', 'Owner_twRPersonaIx' ],
                  Param: 1
               }
            },

            'RMRoot:rmcobject_close': {
               SqlData: {
                  sProc: 'set_RMRoot_RMCObject_Close',
                  aData: [ 'twRMRootIx', 
                           'twRMCObjectIx_Close', 'bDeleteAll' 
                  ],
                  Param: 1
               }
            },

            'RMRoot:rmcobject_open': {
               SqlData: {
                  sProc: 'set_RMRoot_RMCObject_Open',
                  aData: [ 'twRMRootIx', 
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

            'RMRoot:rmpobject_close': {
               SqlData: {
                  sProc: 'set_RMRoot_RMPObject_Close',
                  aData: [ 'twRMRootIx', 'twRMPObjectIx_Close', 'bDeleteAll' ],
                  Param: 1
               }
            },

            'RMRoot:rmpobject_open': {
               SqlData: {
                  sProc: 'set_RMRoot_RMPObject_Open',
                  aData: [ 'twRMRootIx',
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

            'RMRoot:rmtobject_close': {
               SqlData: {
                  sProc: 'set_RMRoot_RMTObject_Close',
                  aData: [ 'twRMRootIx', 'twRMTObjectIx_Close', 'bDeleteAll' ],
                  Param: 1
               }
            },

            'RMRoot:rmtobject_open': {
               SqlData: {
                  sProc: 'set_RMRoot_RMTObject_Open',
                  aData: [ 'twRMRootIx',
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
         },
         RunQuery2
      );
   }
}

/*******************************************************************************************************************************
**                                                     Initialization                                                         **
*******************************************************************************************************************************/

module.exports = HndlrRMRoot;

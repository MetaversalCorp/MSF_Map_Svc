
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
const { RunQuery2, RunQuery2Ex  } = require ('../utils.js');

/*******************************************************************************************************************************
**                                                     Internal                                                               **
*******************************************************************************************************************************/

const g_awClass_Data = 
{
    70:  {                 // SBM_CLASS_RMROOT
            sParam: '',                    
            sProc:  'get_RMRoot_Update'
         },
    71:  {                 // SBM_CLASS_RMCObject
            sParam: 'twRMCObjectIx', 
            sProc:  'get_RMCObject_Update'
         },
    72:  {                 // SBM_CLASS_RMTObject
            sParam: 'twRMTObjectIx',
            sProc:  'get_RMTObject_Update'
         },
    73:  {                 // SBM_CLASS_RMPObject
            sParam: 'twRMPObjectIx',
            sProc:  'get_RMPObject_Update'
         },
};

class HndlrRMBase extends MVHANDLER
{
   constructor ()
   {
      super 
      (
         null, 
         null,
         null,
         {
            "subscribe": {
               sCB: "Subscribe"
            },
            "unsubscribe": {
               sCB: "Unsubscribe"
            },
         },
         RunQuery2
      );
   }

   Subscribe (pConn, Session, pData, fnRSP, fn)
   {
      let pParam = {};
      let aParam;

      if (pData.wClass_Object && g_awClass_Data[pData.wClass_Object])
      {
         if (g_awClass_Data[pData.wClass_Object].sParam != '')
         {
            aParam = [ g_awClass_Data[pData.wClass_Object].sParam ];
            pParam[g_awClass_Data[pData.wClass_Object].sParam] = pData.twObjectIx;
         }
         else aParam = [];

         RunQuery2Ex 
         (
            Session, 
            pParam, 
            fnRSP, 
            fn, 
            true, 
            {
               sProc: g_awClass_Data[pData.wClass_Object].sProc,
               aData: aParam,
               Param: true
            }
         );
      }
   }

   Unsubscribe (pConn, Session, pData, fnRSP, fn)
   {
      if (Session.pSocket)
         Session.pSocket.leave (pData.wClass_Object + '-' + pData.twObjectIx);
   }

}

/*******************************************************************************************************************************
**                                                     Initialization                                                         **
*******************************************************************************************************************************/

module.exports = HndlrRMBase;

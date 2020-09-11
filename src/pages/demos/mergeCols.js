import React from 'react'
import { Modal,Table, Button,Form,Input,  Popconfirm, notification,Select, message} from 'antd';

const Welcome = (props)=> 
{
    //message.info("props.unitts=" + props.unitts);
    return <h1>Hello,{props.children}</h1>;
  }
    //message.info("props=" + props);
//     props.col.map(col => {
//     //console.log(' col.isOper: ' + col.isOper);
//     if (!col.editable) {

//       if(col.isOper === true){
//         col.render = (text, record,index) => {
//           //console.log('到这里显示了');
//           const editable = props.isEditing(record);
//          // editable = true;
//           return editable ? (
//             <span>
//               <a
//                 //href=""
//                 onClick={() => props.save(record.id)}
//                 style={{
//                   marginRight: 8,
//                 }}
//               >
//                 保存
//               </a>
              
//               <a onClick={props.cancel} >取消</a>
              
              
                
//             </span>
//           ) : (
//             <span>
//             <Button type="primary" disabled={props.editingKey !== ''} onClick={() => props.edit(record)}
//             style={{
//               marginRight: 8,
//             }}>
//               编辑
//             </Button>
//             <Popconfirm 
//                 title='确定删除么?'
//                 onCancel={()=>props.cancel}
//                 onConfirm={()=>props.confirmDel(record.id)}
//                 disabled={props.editingKey !== ''||props.sourceUrl=== 'zyCollection'}
//                >
//             <Button type="primary" hidden={props.sourceUrl === 'zyCollection'}  disabled={props.editingKey !== ''}
//             style={{
//               marginRight: 8,
//             }}>
//                   删 除
//             </Button>
//             </Popconfirm>

//             <Popconfirm 
//                 title='确定终止该合同么?'
//                 onCancel={()=>props.cancel}
//                 onConfirm={()=>props.confirmDel(record.id,2)}
//                 disabled={props.editingKey !== ''|| record.status === 2}
//                >
//             <Button type="primary" hidden={props.sourceUrl !== 'zyContract'}  disabled={props.editingKey !== '' || record.status === 2}
//             style={{
//               marginRight: 8,
//             }}>
//                   终止
//             </Button>
//             </Popconfirm>
            
//             </span>
//           );
//         }
//       }
      
//       return col;
//     }

//     return {
//       ...col,
      
//       onCell: (record,rowIndex) => (
          
//     {
//         //record,
//         inputType: props.parseInputNode(col.dataIndex),
//         rowIndex,
//         isWarn: record.isWarn?true:false,
//         //isWarn:rowIndex === record.
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: props.isEditing(record),
//         record
//       }
//       ),
//     };
//   })
//   return props.col;
//}

export default Welcome;

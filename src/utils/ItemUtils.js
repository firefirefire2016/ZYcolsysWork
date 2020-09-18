import React, { useEffect, useState } from 'react'
import { Select, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

/**
 * 字典项
 */
export const selectItems = {
  /**
   * 招租方式
   */
  renttypes: ['公开招租', '梅华办带合同移交', '苗圃场职工安置房', '狮山办带合同移交', '续租'],


  unitts: ['国有单位', '合资单位', '私有单位'],

  itemnames: ['全部', '合同租金', '押金', '管理费', '其他'],

  overstates: ['全部', '即将逾期', '逾期', '正常'],

  amountselect: ['全部', '未缴费', '其他'],

  invoiceselect: ['全部', '未开票', '其他'],

  yesOrNo: ['否', '是'],
  /**
   * 社区
   */
  communitys: ['翠香', '高新区', '拱北', '横琴高新区', '吉大', '梅华', '南屏', '前山', '狮山', '湾仔', '香洲'],

  /**
   * 合同状态
   */
  //contract_status: ['作废(已终止)', '执行中', '草稿', '退租中', '退租待结算', '已到期'],

  contract_status: ['你好', '执行中', '草稿', '退租中', '退租待结算', '已到期'],

  rentmodes: ['固定租金', '费率', '其他'],

}

export const parseRules = (item) => {
  switch (item.dataIndex) {
    case 'quitdate':
      return (
        [
          {
            required: false,
            message: '请输入' + item.title,
          }
        ]
      )
    default:
      return (
        [
          {
            required: true,
            message: '请输入' + item.title,
          }
        ]
      )
  }


}

const getSelects = (item, selects, isValue) => {
  if (isValue) {
    return (
      <Select placeholder={item.title} style={{ width: '200px' }}
        onSelect={() => {
        }}
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        showSearch={true}
      >
        {selects.map((temp, index) => (
          <Option key={index} value={index}>{temp}</Option>
        ))}
      </Select>
    )
  }
  return (
    <Select placeholder={item.title} style={{ width: '200px' }}
      onSelect={() => {
      }}
      optionFilterProp='children'
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      showSearch={true}>
      {selects.map((temp, index) => (
        <Option key={index} >{temp}</Option>
      ))}
    </Select>
  )
}

export const parseInputNode = (item,selects) => {

  let inputType = parseItemtype(item.dataIndex);

  var editble = item.editable;

  let inputNode = <Input type={inputType} placeholder={item.title} disabled={!editble}
    style={{ width: '200px' }
    } />;

  if (item.isSelect) {
    inputNode = <Input type={inputType} placeholder={item.title}
      style={{ width: '200px' }
      } />;
  }


  switch (inputType) {
    case 'Contractnoselect':
      if(selects){
        inputNode = getSelects(item,selects);
      }      
      break;
    case 'UnitType':
      inputNode = getSelects(item,selectItems.unitts);
      break;
    case 'RentType':
      inputNode = getSelects(item,selectItems.renttypes);
      break;
    case 'RentMode':
      inputNode = getSelects(item,selectItems.rentmodes);
      break;
    case 'ContractStatus':
      inputNode = getSelects(item,selectItems.contract_status, true);
      break;
    case 'NeedCopy':
      inputNode = getSelects(item,selectItems.yesOrNo);
      break;
    case 'Amountselect':
      inputNode = getSelects(item,selectItems.amountselect);
      break;
    case 'Invoiceselect':
      inputNode = getSelects(item,selectItems.invoiceselect);
      break;
    case 'OverState':
      inputNode = getSelects(item,selectItems.overstates);
      break;
    case 'ItemNames':
      inputNode = getSelects(item,selectItems.itemnames);
      break;
    default:
      break;
  }

  return inputNode;
}

/**
 * 把数据转换成要显示的内容
 * @param {*} record 记录
 * @param {*} labelType 显示类型
 * @param {*} chil chilren
 */
export const parseTypeToLabel = (record, dataIndex, chil) => {
  switch (dataIndex) {
    case 'renttype':
      return selectItems.renttypes[record.renttype];
    case 'amount_received':
      if (parseFloat(record.amount_received) > 0) {
        return chil;
      }
      if (parseFloat(record.amount_received) === 0) {
        return selectItems.amountselect[1];
      }
      return chil;
    case 'invoice_amount':
      if (parseFloat(record.invoice_amount) > 0) {
        return chil;
      }
      if (parseFloat(record.invoice_amount) === 0) {
        return selectItems.invoiceselect[1];
      }
      return chil;
    default:
      return chil;
  }

}

export const consoleTarget = (target) => {
  console.log('taget:' + JSON.stringify(target));
}


export const parseItemtype = (dataIndex) => {
  let itemType = 'text';
  switch (dataIndex) {
    case 'select_contractno':
      itemType = 'Contractnoselect';
      break;
    case 'amount_receivable':
      itemType = 'number';
      break;
    case 'amount_received':
      itemType = 'number';
      break;
    case 'invoice_limit':
      itemType = 'number';
      break;
    case 'invoice_amount':
      itemType = 'number';
      break;
    case 'invoicedate':
      itemType = 'date';
      break;
    case 'collectdate':
      itemType = 'date';
      break;
    case 'amount_select':
      itemType = 'Amountselect';
      break;
    case 'invoice_select':
      itemType = 'Invoiceselect';
      break;
    case 'overstate':
      itemType = 'OverState';
      break;
    case 'itemname':
      itemType = 'ItemNames';
      break;
    case 'contract_status':
      itemType = 'ContractStatus';
      break;
    case 'startdate':
      itemType = 'date';
      break;
    case 'enddate':
      itemType = 'date';
      break;
    case 'firstdate':
      itemType = 'date';
      break;
    case 'signdate':
      itemType = 'date';
      break;
    case 'rentmode':
      itemType = 'RentMode';
      break;
    case 'needcopy':
      itemType = 'NeedCopy';
      break;
    case 'quitdate':
      itemType = 'date';
      break;
    case 'deposit':
      itemType = 'number';
      break;
    case 'tel_tenant':
      itemType = 'number';
      break;
    case 'unit_type':
      itemType = 'UnitType';
      break;
    case 'renttype':
      itemType = 'RentType';
      break;
    case 'isOwe':
      itemType = 'isOweType';
      break;
    case 'needInvoice':
      itemType = 'needInvoiceType';
      break;
    case 'month_rent':
      itemType = 'number';
      break;
    case 'rentdate':
      itemType = 'number';
      break;
    default:
      itemType = 'text';
      break;
  }
  return itemType;
}



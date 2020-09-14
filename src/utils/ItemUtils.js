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

  yesOrNo: ['否', '是'],
  /**
   * 社区
   */
  communitys: ['翠香', '高新区', '拱北', '横琴高新区', '吉大', '梅华', '南屏', '前山', '狮山', '湾仔', '香洲'],

  /**
   * 合同状态
   */
  contract_status: ['作废(已终止)','执行中', '草稿', '退租中', '退租待结算', '已到期'],

  rentmodes: ['固定租金', '费率', '其他'],

}

export const parseRules = (item) => {
  if (item.dataIndex === 'quitdate') {
    return (
      [
        {
          required: false,
          message: '请输入' + item.title,
        }
      ]
    )
  }
  return (
    [
      {
        required: true,
        message: '请输入' + item.title,
      }
    ]
  )

}

export const parseInputNode = (item) => {

  let inputType = parseItemtype(item.dataIndex);

  var editble = item.editable;

  let inputNode = <Input type={inputType} placeholder={item.title} disabled={!editble}
    style={{ width: '200px' }} />;





  switch (inputType) {
    case 'UnitType':
      inputNode = <Select placeholder={item.title} style={{ width: '200px' }}>
        {selectItems.units.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
      break;
    case 'RentType':
      inputNode = <Select placeholder={item.title} style={{ width: '200px' }}>
        {selectItems.renttypes.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
      break;
    case 'RentMode':
      inputNode = <Select placeholder={item.title} style={{ width: '200px' }}
        onSelect={() => {
          // message.success('添加');
        }}
      >

        {selectItems.rentmodes.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
      break;
    case 'ContractStatus':
      inputNode = <Select placeholder={item.title} style={{ width: '200px' }}
        onSelect={() => {
        }}
      >

        {selectItems.contract_status.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
      break;
    case 'NeedCopy':
      inputNode = <Select placeholder={item.title} style={{ width: '200px' }}>
        {selectItems.yesOrNo.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
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
export const parseTypeToLabel = (record, labelType, chil) => {
  switch (labelType) {
    case 'RentType':
      return selectItems.renttypes[record.renttype];
    case 'isOweType':
      return selectItems.yesOrNo[record.isOwe];
    case 'needInvoiceType':
      return selectItems.yesOrNo[record.needInvoice];
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



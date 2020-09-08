import React, { useEffect, useState } from 'react'
import { Select, Input } from 'antd';

const { Option } = Select;

/**
 * 字典项
 */
export const selectItems = {
  /**
   * 招租方式
   */
  renttypes: ['公开招租', '梅华办带合同移交', '苗圃场职工安置房', '狮山办带合同移交', '续租'],


  unitts:['国有单位','合资单位','私有单位'],

  /**
   * 社区
   */
  communitys: ['翠香', '高新区', '拱北', '横琴高新区', '吉大', '梅华', '南屏', '前山', '狮山', '湾仔', '香洲']

}

export const parseInputNode = (item) => {
  let inputType = parseItemtype(item.dataIndex);
  let inputNode = <Input type={inputType} placeholder={item.title}/>;

  

  switch (inputType) {
    case 'Unit':
      inputNode = <Select  placeholder={item.title}>
        {selectItems.units.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
      break;
    case 'RentType':
      inputNode = <Select  placeholder={item.title}>
        {selectItems.renttypes.map((temp, index) => (
          <Option key={index} >{temp}</Option>
        ))}
      </Select>;
      break;

    default:
      break;
  }

  return inputNode;
}

export const parseTypeToLabel = (record, labelType, chil) => {
  switch (labelType) {
    case 'RentType':
      return selectItems.renttypes[record.renttype];
    default:
      return chil;
  }

}


export const parseItemtype = (dataIndex) => {
  let itemType = 'text';
  switch (dataIndex) {
    case 'startdate':
      itemType = 'date';
      break;
    case 'enddate':
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
    default:
      itemType = 'text';
      break;
  }
  return itemType;
}



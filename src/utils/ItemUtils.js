import React, { useEffect, useState } from 'react'
import { Select, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

//var mode = '';

var canEdit = true;

/**
 * 字典项
 */
export const selectItems = {
  /**
   * 招租方式
   */
  renttypes: ['公开招租', '梅华办带合同移交', '苗圃场职工安置房', '狮山办带合同移交', '续租'],

  rentcycles: ['免租期', '首期收款', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

  accountingunits: ['园艺场', '金都', '南利', '区房产', '三业'],//核算单位

  unitts: ['国有单位', '合资单位', '私有单位'],

  itemnames: ['全部', '合同租金', '押金', '管理费', '其他'],

  create_itemnames: ['押金', '管理费', '其他'],

  overstates: ['全部', '即将逾期', '逾期', '正常'],

  amountselect: ['全部', '未缴费', '其他'],

  invoiceselect: ['全部', '未开票', '其他'],

  yesOrNo: ['否', '是'],

  isOwes: ['全部', '无欠费', '其他'],

  needInvoices: ['全部', '无欠票', '其他'],


  /**
   * 社区
   */
  communitys: ['翠香', '高新区', '拱北', '横琴高新区', '吉大', '梅华', '南屏', '前山', '狮山', '湾仔', '香洲'],

  //_communitys: ['全部', '翠香', '高新区', '拱北', '横琴高新区', '吉大', '梅华', '南屏', '前山', '狮山', '湾仔', '香洲'],

  righttype: ['办公楼', '厂房', '车库', '商铺', '铁皮棚', '学校', '幼儿园', '住宅'],

  //_righttype: ['办公楼', '厂房', '车库', '商铺', '铁皮棚', '学校', '幼儿园', '住宅'],

  owners: ['财办', '财贸办公室', '财政局', '地属村，房屋按比例', '地属村，建筑属公司', '拱北中学', '吉大办',
    '建安公司', '梅华办', '南利公司', '南利集团', '狮山办', '湾仔小学', '香华实验学校', '香洲区教育局', '香洲区景园小学', '香洲区科学技术委员会',
    '香洲区园艺场', '新华公司', '珠海市第五中学', '珠海市前山中学', '珠海市香洲区房地产综合开发公司'],

  //_owners: ['财办', '财贸办公室', '财政局', '地属村，房屋按比例', '地属村，建筑属公司', '拱北中学', '吉大办',
  //  '建安公司', '梅华办', '南利公司', '南利集团', '狮山办', '湾仔小学', '香华实验学校', '香洲区教育局', '香洲区景园小学', '香洲区科学技术委员会',
  //  '香洲区园艺场', '新华公司', '珠海市第五中学', '珠海市前山中学', '珠海市香洲区房地产综合开发公司'],

  features: ['企业物业', '行政物业'],

  // _features: ['企业物业', '行政物业'],

  /**
   * 合同状态
   */
  //contract_status: ['作废(已终止)', '执行中', '草稿', '退租中', '退租待结算', '已到期'],

  property_status: ['已租', '空置', '即将空置'],

  // _property_status: ['已租', '空置', '即将空置'],

  contract_status: ['未生效', '已生效', '即将到期', '已到期', '已失效'],

  // _contract_status: ['未生效', '已生效', '即将到期', '已到期', '已失效'],



  rentmodes: ['固定租金', '费率', '其他'],

  copytype: ['无需', '单月', '双月', '每月'],

  tenanttype: ['企业', '个人',],

  rentmode: ['固定租金', '费率', '其他'],





}

export const parseRules = (item) => {
  if (item.isMust === true) {
    return (
      [
        {
          required: true,
          message: '请输入' + item.title,
        }
      ]
    )
  }
  else {
    return (
      [
        {
          required: false,
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
        disabled={!canEdit}
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
      disabled={!canEdit}
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

export const parseInputNode = (item, mode = 'screening', selects) => {
  let inputType = parseItemtype(item.dataIndex);
  canEdit = true;
  switch (mode) {
    case 'screening'://筛选模式
      //筛选模式下，所有可筛选的都在form中，且不禁用
      canEdit = true;

      break;
    case 'showing'://列表展现模式


      break;
    case 'editing'://编辑模式
      //编辑模式下，iten.editable过滤不能编辑的字段
      canEdit = item.editable
      break;
    case 'creating'://创建模式
      //编辑模式下，iten.editable过滤不能编辑的字段
      canEdit = item.editable
      break;
    case 'details'://详情模式
      //详情模式下，所有字段不能使用
      canEdit = false;
      break;
    case 'keepon':
      //续租模式下，iten.editable过滤不能编辑的字段
      canEdit = item.editable
      break;

    default:
      break;
  }


  let inputNode = <Input type={inputType} placeholder={item.title} disabled={!canEdit}
    style={{ width: '200px' }
    } />;


  switch (inputType) {
    case 'Contractnoselect':
      if (selects) {
        inputNode = getSelects(item, selects, true);
      }
      break;
    case 'UnitType':
      inputNode = getSelects(item, selectItems.unitts, false);
      break;
    case 'RentType':
      inputNode = getSelects(item, selectItems.renttypes, false);
      break;
    case 'RentMode':
      inputNode = getSelects(item, selectItems.rentmodes, false);
      break;
    case 'ContractStatus':
      inputNode = getSelects(item, selectItems.contract_status, true);
      break;
    case 'NeedCopy':
      inputNode = getSelects(item, selectItems.yesOrNo, false);
      break;
    case 'Amountselect':
      inputNode = getSelects(item, selectItems.amountselect, false);
      break;
    case 'Invoiceselect':
      inputNode = getSelects(item, selectItems.invoiceselect, false);
      break;
    case 'OverState':
      inputNode = getSelects(item, selectItems.overstates, false);
      break;
    case 'ItemNames':
      inputNode = getSelects(item, selectItems.itemnames, false);
      break;
    case 'CItemNames':
      inputNode = getSelects(item, selectItems.create_itemnames, true);
      break;
    case 'Owners':
      inputNode = getSelects(item, selectItems.owners, false);
      break;
    case 'Property_status':
      inputNode = getSelects(item, selectItems.property_status, false);
      break;
    case 'Features':
      inputNode = getSelects(item, selectItems.features, false);
      break;
    case 'Communitys':
      inputNode = getSelects(item, selectItems.communitys, false);
      break;
    case 'Righttype':
      inputNode = getSelects(item, selectItems.righttype, false);
      break;
    case 'Accountingunit':
      inputNode = getSelects(item, selectItems.accountingunits, false);
      break;
    case 'Copytype':
      inputNode = getSelects(item, selectItems.copytype, false);
      break; 
    case 'Rentcycle':
      inputNode = getSelects(item, selectItems.rentcycles, false);
      break;
    // case 'Rightno':
    //   if (selects) {
    //     inputNode = getSelects(item, selects, false);
    //   }
    //   break;
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
    case 'contract_status':
      return selectItems.contract_status[record.contract_status];
    case 'accountingunit':
      return selectItems.accountingunits[record.accountingunit];
    case 'community':
      return selectItems.communitys[record.community];
    case 'feature':
      return selectItems.features[record.feature];
    case 'property_status':
      return selectItems.property_status[record.property_status];
    case 'owner':
      return selectItems.owners[record.owner];
    case 'righttype':
      return selectItems.righttype[record.righttype];
    case 'renttype':
      return selectItems.renttypes[record.renttype];
    case 'itemname':
      return selectItems.itemnames[record.itemname];
    case 'overstate':
      return selectItems.overstates[record.overstate];
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
    case 'effectdate':
      itemType = 'date';
      break;
    case 'stopdate':
      itemType = 'date';
      break;
    case 'rightno':
      itemType = 'text';
      break;
    case 'freestartdate':
      itemType = 'date';
      break;
    case 'freeenddate':
      itemType = 'date';
      break;
    case 'tel_tenant':
      itemType = 'number';
      break;
    case 'tenant_idno':
      itemType = 'number';
      break;
    case 'latefeesrate':
      itemType = 'number';
      break;
    case 'rentcycle':
      itemType = 'Rentcycle';
      break;
    case 'copytype':
      itemType = 'Copytype';
      break;
    case 'accountingunit':
      itemType = 'Accountingunit';
      break;
    case 'limitdate':
      itemType = 'date';
      break;
    case 'insidearea':
      itemType = 'number';
      break;
    case 'area':
      itemType = 'number';
      break;
    case 'righttype':
      itemType = 'Righttype';
      break;
    case 'community':
      itemType = 'Communitys';
      break;
    case 'feature':
      itemType = 'Features';
      break;
    case 'property_status':
      itemType = 'Property_status';
      break;
    case 'owner':
      itemType = 'Owners';
      break;
    case 'create_itemname':
      itemType = 'CItemNames';
      break;
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



import React from 'react'
import { Card,Table,Button } from 'antd'

function zyContractList() {
    return (
       <Card title="合同列表" 
       extra={
           <Button type="primary" size="large">
               新增合同
           </Button>

       }>
        <Table></Table>
       </Card>
    )
}

export default zyContractList


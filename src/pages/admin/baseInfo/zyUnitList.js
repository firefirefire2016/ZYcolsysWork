import React from 'react'
import { Card, Button, Table } from 'antd'

function zyUnitList() {
    return (
        <Card title="单位列表" 
        extra={
            <Button type="primary" size="large">
                新增单位资料
            </Button>
 
        }>
         <Table></Table>
        </Card>
     )
}

export default zyUnitList

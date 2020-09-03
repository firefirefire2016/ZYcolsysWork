import React from 'react'
import { Card,Table,Button } from 'antd'

function propertyRight() {
    return (
        <Card title="产权证列表" 
        extra={
            <Button type="primary" size="large">
                新增产权证
            </Button>
 
        }>
         <Table></Table>
        </Card>
     )
}

export default propertyRight

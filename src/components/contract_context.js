import React from 'react'

export const defaultdata = [{
    "code":0,
    "data":[
        {
            "contractno":"",
            "startdate":"",
            "enddate":"",
            "renttype":"",
            "rightno":""
        },
    ],
    "msg":""
}];



export const ContractData = React.createContext(
    defaultdata // 默认值
);
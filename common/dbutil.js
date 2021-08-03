/**
 * Created by Administrator on 2020/10/21 0021.
 */

const mysql=require('mysql');
const config = require('../config');
const pool=mysql.createPool(config.db);
module.exports= function(sql,params,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null);
        }else{
            conn.query(sql,params,function(error,results){
                conn.release();
                callback(error,results);
            })
        }
    });
};

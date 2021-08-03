## 简介

本项目名称为简衣，是一个服装类的电商网站。

##### 技术栈：

node.js+Express+MySQL+jQuery

## 功能

 - 前台用户界面相关功能

    - 登录	/	注册	/	忘记密码	/	修改密码	/	注销账号	/	退出登录

    - 修改个人资料

       -	头像、真实姓名、用户名、性别、出生日期、收货地址、电话、邮编、找回密码问题、找回密码答案

   -	购物相关

     -	添加购物车、删除购物车商品、结算、数量的增减、猜你喜欢、立即购买

   -	订单

     -	取消订单、去未付款的订单进行付款、申请退款、修改收货地址、申请退货、确认收货、查看订单详情、评论已经收货的商品、删除评论

       ps：没有接真正的付款流程，上述付款均是点击确认付款就完成付款了。

- 后台管理界面
  - 首页的相关统计
    - 总收入、用户总数、下单总量、评论总量
  - 用户信息管理
    - 根据真实姓名、上次登录时间进行筛选
    - 冻结用户账号
    - 升级普通用户为VIP用户（ps：VIP用户可享受相关优惠）
  - 订单信息管理
    - 根据订单号、订单状态进行筛选
    - 发货
    - 退款 / 拒绝退款
    - 删除已经退款的订单
  - 评论信息管理
    - 根据评论内容进行筛选
    - 回复用户评论、删除自己的评论
  - 商品信息管理
    - 添加商品
    - 根据商品名称进行筛选
    - 商品上下架、上下热门
    - 销量统计
    - 删除未上过架的商品
    - 编辑商品
      - 商品名称、商品价格、类别、类型、型号、图片、详情、库存
      - 设置优惠
        - 优惠力度（1-9折）
        - 优惠对象（不优惠、全体用户、仅VIP用户）

## 数据库

### 数据库命名规范

- 数据库命名规则:英文命名，库名为对该数据库的描述，如:项目的数据库名为jane。

- 数据表命名规则:“表描述词”，例：users表示用户表。

- 数据字段名：“表描述词”+“字段描述词”，例：username表示用户名称。

用户信息表（users）

| 字段名       | 字段说明         | 字段类型 | 是否为空 | 备注                                |
| ------------ | ---------------- | -------- | -------- | ----------------------------------- |
| userid       | 用户ID           | int      | 否       | PK                                  |
| realname     | 用户真实姓名     | varchar  | 否       |                                     |
| sex          | 用户性别         | varchar  | 是       |                                     |
| birthday     | 用户出生日期     | datetime | 是       |                                     |
| address      | 用户默认收货地址 | varchar  | 是       |                                     |
| phone        | 用户电话         | varchar  | 是       |                                     |
| username     | 用户昵称         | varchar  | 否       |                                     |
| psw          | 密码             | varchar  | 否       |                                     |
| role         | 角色             | varchar  | 否       | 1表示管理员，0表示普通用户，默认为0 |
| question     | 找回密码问题     | varchar  | 是       |                                     |
| answer       | 找回密码答案     | varchar  | 是       |                                     |
| state        | 用户状态         | varchar  | 否       | 1表示正常，0表示冻结，默认为1       |
| vip          | vip用户          | varchar  | 否       | 0为普通用户，1为VIP用户，默认为0    |
| handportrait | 用户头像         | varchar  | 是       | 默认为1.jpg                         |
| time         | 用户上次登录时间 | datetime | 是       |                                     |

商品信息表（goods）

| 字段名   | 字段说明     | 字段类型 | 是否为空 | 备注                                     |
| -------- | ------------ | -------- | -------- | ---------------------------------------- |
| goodid   | 商品ID       | int      | 否       | PK                                       |
| goodname | 商品名称     | varchar  | 否       |                                          |
| price    | 商品价格     | varchar  | 是       |                                          |
| style    | 商品类别     | varchar  | 否       | 1表示男装，0表示男装，默认为1            |
| type     | 商品类型     | varchar  | 是       |                                          |
| picture  | 商品图片     | varchar  | 是       |                                          |
| details  | 商品详情     | varchar  | 是       |                                          |
| stock    | 商品库存     | varchar  | 是       |                                          |
| host     | 热门商品     | varchar  | 否       | 1表示热门，0表示不热门                   |
| state    | 商品状态     | varchar  | 否       | 0表示新增，1表示上架，2表示下架，默认为0 |
| object   | 商品优惠对象 | varchar  | 是       |                                          |
| discount | 商品优惠力度 | varchar  | 是       | 0-9折                                    |
| number   | 用户付款次数 | varvhar  | 是       |                                          |
| model    | 商品型号     | varchar  | 是       |                                          |

购物车信息（carts）

| 字段名 | 字段说明 | 字段类型 | 是否为空 | 备注 |
| ------ | -------- | -------- | -------- | ---- |
| cartid | 购物车ID | int      | 否       | PK   |
| userid | 用户ID   | int      | 否       | FK   |
| goodid | 商品ID   | int      | 否       | FK   |
| price  | 商品价格 | varchar  | 是       |      |
| size   | 商品尺寸 | varchar  | 是       |      |
| number | 商品数量 | varchar  | 是       |      |
| model  | 商品型号 | varchar  | 是       |      |

订单信息表（orders）

| 字段名      | 字段说明     | 字段类型 | 是否为空 | 备注 |
| ----------- | ------------ | -------- | -------- | ---- |
| ordernumber | 订单号       | varchar  | 否       | PK   |
| username    | 用户姓名     | varchar  | 否       |      |
| time        | 下单时间     | datetime | 否       |      |
| total       | 金额总计     | varchar  | 否       |      |
| phone       | 用户电话     | varchar  | 是       |      |
| address     | 用户收货地址 | varchar  | 是       |      |
| state       | 订单状态     | varchar  | 否       |      |
| rstate      | 商品退款状态 | varchar  | 否       |      |

订单详情信息表（ordersdetails）

| 字段名      | 字段说明 | 字段类型 | 是否为空 | 备注 |
| ----------- | -------- | -------- | -------- | ---- |
| id          | 订单id   | Int      | 否       | PK   |
| ordernumber | 订单号   | varchar  | 否       | FK   |
| goodid      | 商品id   | int      | 否       | FK   |
| size        | 商品尺寸 | varchar  | 否       |      |
| number      | 商品数量 | varchar  | 否       |      |
| price       | 商品价格 | varchar  | 否       |      |

用户评论信息表（comments）

| 字段名    | 字段说明     | 字段类型 | 是否为空 | 备注                     |
| --------- | ------------ | -------- | -------- | ------------------------ |
| commentid | 用户评论id   | int      | 否       | PK                       |
| goodid    | 商品ID       | int      | 否       | FK                       |
| userid    | 用户ID       | int      | 否       | FK                       |
| content   | 评价内容     | varchar  | 是       |                          |
| time      | 评价时间     | datetime | 是       |                          |
| state     | 评论回复状态 | varchar  | 否       | 0表示未回复，1表示已回复 |

管理员回复用户评论信息表（admincomment）

| 字段名       | 字段说明         | 字段类型 | 是否为空 | 备注 |
| ------------ | ---------------- | -------- | -------- | :--- |
| id           | 管理员回复评论id | int      | 否       | PK   |
| commentid    | 用户评论id       | int      | 否       | FK   |
| goodid       | 商品ID           | int      | 否       | FK   |
| userid       | 用户ID           | int      | 否       | FK   |
| admincontent | 回复内容         | varchar  | 是       |      |
| time         | 回复时间         | datetime | 是       |      |

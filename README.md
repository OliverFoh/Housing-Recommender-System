# 基于内容相似度的房源推荐系统

## 项目介绍

​		本项目为本科期间的毕业设计，因为之前有做过房源网站的爬虫与数据分析，所以当时希望在此基础上做一些功能的扩充，于是就选择了去实现一个基于内容相似度的房源推荐系统。

## 摘要

​		推荐系统是一种信息过滤系统，旨在解决人们所面临着的信息冗余、过载的问题。 随着互联网上房源信息越来越多，人们从大量的房产信息中找到自己需要的信息也变得 越来越困难，传统的搜索引擎具有明确的目的性，但需要用户提供明确的信息，而推荐 系统可以发掘长尾信息，主动给用户推荐满足用户兴趣的信息。基于内容推荐算法的房源推荐系统利用房源的面积、户型、价格等属性字段去计算不同房源之间的相似度，从 而返回某个房源的 TopN 相似度列表完成推荐。

## 总体架构

<img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3lx5buqnj30nu0ktab2.jpg" style="zoom:70%;" />

​		本系统主要分为三大模块：展示层基于 微信小程序构建，方便快捷；服务层利用 Python 实现余弦相似度算法计算房源之间相 似度，再搭建远程过程调用服务，服务端对外则使用 SpringBoot 框架搭建 Restful API 接口；数据层以 Mysql 数据库作为支撑，存储关系型数据，同时使用 Redis 缓存作为辅 助来存储推荐结果，从而提高推荐系统对于前端的响应速度。另外，在项目前期利用爬 虫程序爬取房源信息，并进行了数据清洗、去重等工作，从而为数据的特征提取、处理 打下了一个良好的基础。开发工具主要使用了 JetBrains 公司开发的 IntelliJ IDEA 与 Pycharm、微信开发者工具、PostMan 接口测试工具。

## 展示层

### 微信小程序

#### 小程序架构图

<img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3ljo14qzj30mt0f2gnl.jpg" style="zoom:60%;" />

#### 页面结构

<img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3lma1xldj30do09a74c.jpg" style="zoom:90%;" />

​		小程序的项目结构可大致分为第三方 UI 组件目录、页面目录、和小程序全局 配置文件。小程序开发引用到了 iView Weapp 组件库与 Wux App 组件库，这些都 是小程序开发中比较常用的第三方 UI 组件库；页面总共分为了七个页面，其中有 些页面进行了多次代码复用 ；小程序全局配置文件主要是注册小程序的生命周 期函数、全局样式、Tab 页面注册及负责一些小程序初始化的逻辑。

## 服务层

### 推荐算法

1. 数据预处理

   ​		原始的文本数据不能直接参与运算，需要对其进行一系列的数据处理才能满足参与算法运算的要求。同时，数据预处理的好坏直接决定了系统最终生成的推荐结果的好坏，因此数据预处理阶段主要是原始数据进行清洗、去重、编码、区间放缩等处理，使之数据格式能够满足算法可以直接进行向量计算的格式。

   原始文本数据如下：

   <img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3ohwititj30lw0u1754.jpg" style="zoom:80%;" />

2. One-Hot编码

   ​		清洗、去重等操作一般在爬取数据时同步进行，而在完成这两部操作后则开始进行独热编码（One-Hot），独热编码又称一位有效编码。其方法是使用 N位状态寄存器来对N个状态进行编码，每个状态都有它独立的寄存器位，并且在任意时候，其中只有一位有效。One-Hot编码的核心思想是将分类的变量值作为二进制向量进行表示。例如属性字段“ori”在进行One-Hot编码后映射为四个分量，四个分量有且仅有一个值置为1，即任何时候只有一位有效。

   “朝向” 字段独热编码结果：

   <img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3ojop58vj30ig0713ye.jpg" style="zoom:80%;" />

3. 0-1标准化

   ​		0-1标准化也称为离差标准化，它是对原始数据进行变换，使之落到[0,1]区间范围。房源数据中比如“价格”字段的数值与“面积”字段的数值会相差较大，若不经过量化处理直接参与运算，则容易导致计算结果偏差较大，因而需要标准化处理。标准化处理的具体过程是使用某个数值与该字段最小值的差除以该字段的区间长度，相当于进行了一次区间放缩。
   $$
   X=(x-min)/(max⁡-min)
   $$
   数据标准化结果：

   <img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3on84hx3j314j0khq60.jpg" style="zoom:50%;" />

4. 余弦相似度算法

   ​		余弦相似度算法是一种常见的计算物品之间相似度的算法，其核心思想是对两个向量相乘再除以两个向量的模长之积，其比较适合高维度的数据计算。余弦相似度的结果小于1，越接近1代表余弦角度越小，即两个物品向量越相似；反之，数值越远离1，则说明两个向量之间的相关性较低。

   余弦相似度公式为：

   ![](http://ww1.sinaimg.cn/large/006SFsamly1gs3opwyzunj30c2035a9x.jpg)

   房源信息一般信息量比较大，包含价格、面积、户型、装修类型等多个属性信息，本系统在计算房源之间相似度的时候，为提高相似度的准确性，使用了25个属性字段来作为房源向量分量参与计算。

```python
usecols=['id', 'price', 'city', 'rental_method', 'house_type', 'room_type', 'area_size',
                                    'decorate_type', 'ori',
                                    'has_heat', 'has_tv', 'has_refrigerator', 'has_washing_machine',
                                    'has_balcony', 'has_cook', 'has_air_conditioner',
                                    'has_bed', 'has_sofa', 'has_wardrobe', 'has_toilet', 'has_smart_lock',
                                    'has_ventilator',
                                    'has_gas_stove', 'has_wifi', 'room_num', 'bath_num', 'halls_num'])
```

​	在具体的处理计算过程中先根据“城市”属性提取出同一城市的所有房源，然后再使用Pandas模块下的get_dummies方法进行独热编码，使用sklearn.preprocessing模块下的MinMaxScaler进行数据标准化处理。在完成所有的数据预处理过程后使用sklearn.metrics.pairwise模块下的cosine_similarity进行余弦相似度的计算，最终生成相似度矩阵，然后再对相似度矩阵进行排序，查找出TopN相似度列表，最终返回房源ID组成的列表。

```python
    def calculateSimilarity(self):		### 内容相似度计算核心代码 ###
        
        # 筛选出特定城市的房源(data为原始房源列表)
        city_room = data[data['city'].isin([self.city])]
        # 重置索引
        city_room.reset_index(inplace=True, drop=True)

        # 查找room_id所在索引位置
        room_index = city_room[city_room['id'] == self.room_id].index.tolist()
        print(room_index[0])

        # 独热编码
        code_result = pd.get_dummies(city_room)

        # 映射到0-1区间
        standard_result = MinMaxScaler().fit_transform(code_result)
        print('数据预处理结果：')
        print(standard_result[0])

        # 余弦相似度计算，生成相似度矩阵
        cosine_result = cosine_similarity(standard_result)

        index_list = []
        for row_index in range(0, len(cosine_result)):
            if row_index == room_index[0]:
                similarity_list = cosine_result[row_index]
                # 返回前五大元素所在索引值
                index_list = heapq.nlargest(6, range(len(similarity_list)), similarity_list.__getitem__)
                # print('最大元素的索引值为：')
                print(index_list)
                break
        room_id_list = []
        # 查找索引值列表对应的room_id
        for item in index_list:
            room_id_list.append(city_room.loc[item]['id'])
        # 去除相似度最高（本身）元素
        del room_id_list[0]
        print(room_id_list)
        return room_id_list
```

房源相似度矩阵：

<img src="http://ww1.sinaimg.cn/large/006SFsamly1gs3ow6hookj31aw0j8n1a.jpg" style="zoom:80%;" />

### RPC服务

​		在完成上一步的推荐算法搭建后需要搭建对外服务的接口，此时共有两种方法可以选择：可搭建基于HTTP协议的API接口，也可搭建基于TCP协议的远程过程调用（Remote Procedure Call）服务。由于推荐系统需要实时处理大量数据来推送出去，基于HTTP协议的Restful形式的API接口需要传送HTTP头部报文，比较耗费性能，而基于TCP协议的RPC服务则无需封装头部报文，更加高效。

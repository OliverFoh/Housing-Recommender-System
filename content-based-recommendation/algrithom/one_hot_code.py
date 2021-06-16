import pandas as pd
import numpy
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import heapq
import csv

"""
计算余弦相似度并返回topN相似列表
"""


class SimilarityAlgorithm:
    def __init__(self, file_name, city, room_id):
        self.file_name = file_name
        self.city = city
        self.room_id = room_id

    def calculateSimilarity(self):
        data = pd.read_csv(self.file_name,
                           usecols=['id', 'price', 'city', 'rental_method', 'house_type', 'room_type', 'area_size',
                                    'decorate_type', 'ori',
                                    'has_heat', 'has_tv', 'has_refrigerator', 'has_washing_machine',
                                    'has_balcony', 'has_cook', 'has_air_conditioner',
                                    'has_bed', 'has_sofa', 'has_wardrobe', 'has_toilet', 'has_smart_lock',
                                    'has_ventilator',
                                    'has_gas_stove', 'has_wifi', 'room_num', 'bath_num', 'halls_num'])

        # 筛选出特定城市的房源
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


if __name__ == '__main__':
    similarity = SimilarityAlgorithm(file_name="../room.csv", city="北京", room_id='01bd8ca734594c73238b86aff2deb812')
    similarity.calculateSimilarity()
#     calculateSimilarity(file_name="room.csv", city="西安", room_id="0163c8a81316f69adbbdd63ac4768f20")
#     # df = pd.DataFrame([['green', 10.1],
#     #                    ['red', 13.5],
#     #                    ['blue', 15.3]])
#     # df.columns = ['color', 'price']
#     # print(df)
#     # print(pd.get_dummies(df))
#     # # pd.get_dummies(df).as_matrix()
#     # print(pd.get_dummies(df).values)
#     data = pd.read_csv("room.csv",
#                        usecols=['id', 'price', 'city', 'rental_method', 'house_type', 'room_type', 'area_size',
#                                 'decorate_type', 'ori',
#                                 'has_heat', 'has_tv', 'has_refrigerator', 'has_washing_machine',
#                                 'has_balcony', 'has_cook', 'has_air_conditioner',
#                                 'has_bed', 'has_sofa', 'has_wardrobe', 'has_toilet', 'has_smart_lock', 'has_ventilator',
#                                 'has_gas_stove', 'has_wifi', 'room_num', 'bath_num', 'halls_num'])
#
#     city_room = pd.DataFrame(data[data['city'].isin(['北京'])])
#     # print(data.head(10))
#
#
#     # 重置索引
#     city_room.reset_index(inplace=True, drop=True)
#     print(city_room.head(5))
#
#     union_id = '0014e2108468d9ef42b291384fb8787c'
#     index_result = city_room[city_room['id'] == union_id].index.tolist()
#     print(index_result)
#
#     # 哑变量编码
#     data = pd.get_dummies(city_room.head(5))
#     print(data.head(5))
#     # 数据归一化，映射到0到1区间
#     results = MinMaxScaler().fit_transform(data)
#     print('数据归一化：')
#     # print(results)
#
#     # 计算余弦相似度
#     cosine_result = cosine_similarity(results)
#     print("余弦相似度计算中...")
#     print(cosine_result[2])
#     index_list = []
#     for row_index in range(0, len(cosine_result)):
#         # if row_index==2:
#         # print(cosine_result[row_index])
#         similarity_list = cosine_result[row_index]
#         max = 0
#         # for index,value in enumerate(similarity_list):
#         #     if similarity_list[max]<value:
#         #         max=index
#
#         index_list = heapq.nlargest(6, range(len(similarity_list)), similarity_list.__getitem__)
#         # print('最大元素的索引值为：')
#         print(index_list)
#         break
#     print(type(cosine_result))
#     # print('Dataframe拼接结果：')
#     # frame_result = pd.concat([id, pd.DataFrame(cosine_result)])
#     # print(frame_result)
#
#     # print('narray拼接结果：')
#     # print(numpy.concatenate((numpy.ndarray(id), cosine_result)))
#     # final_result = pd.concat([id, pd.DataFrame(cosine_result)])
#     # print(final_result)
#     # numpy.ndarray.sort(cosine_result[0])
#     # # sorted_list=list(cosine_result[0])
#     # print(cosine_result[0])
#     # numpy.savetxt("cosine_result.csv", cosine_result, delimiter=",")
#     # print(type(cosine_result[0]))
#     #
#     # cosine_results=pd.DataFrame(cosine_similarity(results))
#     # #print(cosine_similarity((results)))
#     # results.to_csv('{}.csv'.format("results"), encoding="utf-8")
#     # cosine_result.to_csv('{}.csv'.format("cosine_result"), encoding="utf-8")
#     # # csvFile = open("csvData.csv", "w",encoding='utf-8')  # 创建csv文件
#     # # writer = csv.writer(csvFile)  # 创建写的对象
#     # # # 先写入columns_name
#     # # writer.writerow(["index", "a_name", "b_name"])  # 写入列的名称
#     # # # 写入多行用writerows                                #写入多行
#     # # writer.writerows(results)
#     # # csvFile.close()
# """
# , 'rental_method', 'house_type', 'room_type', 'area_size',
#                                 'decorate_type', 'ori',
#                                 'floor_info', 'has_heat', 'has_tv', 'has_refrigerator', 'has_washing_machine',
#                                 'has_balcony', 'has_cook', 'has_air_conditioner',
#                                 'has_bed', 'has_sofa', 'has_wardrobe', 'has_toilet', 'has_smart_lock', 'has_ventilator',
#                                 'has_gas_stove', 'has_wifi', 'traffic', 'room_num', 'bath_num', 'halls_num'
# """

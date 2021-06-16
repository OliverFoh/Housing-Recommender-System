import pymysql
#写入mysql
# def wr_mysql(room_data_list,db):
#     cursor = db.cursor()
#     #sql1="create table if not exists anjuke_house(城市 varchar(10),时间 varchar(15),名称 varchar(30),户型 varchar(20),大小 varchar (20),状态 varchar(10),类型 varchar(5),地址 varchar(50),价格说明 varchar (10),周边均价 varchar (10),价格标准 char(5),价格 int,单元价格 char(10),房屋亮点 varchar(50),primary key (名称,时间))ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1"
#     sql="insert ignore into room_data_data values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
#     try:
#         list1=[]
#         for i in range(len(room_data_list)):
#             tuple1=(room_data['url'],room_data['title'],room_data['city'],room_data['district'],room_data['road'],room_data['community'],room_data['upTime'],room_data['saveTime'],room_data['price'],
#                     room_data['rentalMethod'],room_data['requireType'],room_data['houseType'],room_data['room_dataType'],room_data['areaSize'],room_data['decorateType'],room_data['ori'],room_data['liveInfo'],room_data['rentTimeInfo'],
#                     room_data['viewInfo'],room_data['floorInfo'],room_data['elevtorInfo'],room_data['carInfo'],room_data['waterInfo'],room_data['electrInfo'],room_data['gasInfo'],
#                     room_data['heatInfo'],room_data['hasTelevision'],room_data['hasRefrigerator'],room_data['hasWashingMachine'],room_data['hasBalcony'],room_data['hasCook'],room_data['hasAirConditioner'],
#                     room_data['hasWaterHeater'],room_data['hasBed'],room_data['hasWordrobe'],room_data['hasSofa'],room_data['hasWifi'],room_data['traffic'],room_data['bedroom_data'],room_data['bathroom_data'],
#                     room_data['halls'],room_data['description'],room_data['pic'])
#             list1.append(tuple1)
#         cursor.executemany(sql,list1)
#         db.commit();
#         print('写入成功')
#     except Exception as e:
#         db.rollback()
#         print('写入失败')
#         print(e)
class DataBase:
    def __init__(self,host,user,password,database):
        self.host=host
        self.user=user
        self.password=password
        self.database=database
        self.sql="insert ignore into room_data values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
                 "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
                 "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
                 "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    #初始化mysql连接
    def initConnect(self):
        try:
            self.db = pymysql.connect(self.host,self.user,self.password,self.database)
            print('mysql connection success!')
        except pymysql.OperationalError as e:
            print(e)
            print('mysql connection failed!')
    #插入数据
    def insertionData(self,room_data):
        self.curcor=self.db.cursor()
        try:
            data= (room_data['title'], room_data['city'], room_data['district'],
                      room_data['road'], room_data['community'], room_data['saveTime'],room_data['upTime'],
                      room_data['price'],room_data['payType'], room_data['rentalMethod'],room_data['houseType'],room_data['roomType'],room_data['areaSize'],room_data['decorateType'],room_data['ori'],
                      room_data['floorInfo'],
                      room_data['hasHeat'],room_data['hasTV'],room_data['hasRefrigerator'],room_data['hasWashingMachine'],room_data['hasBalcony'],room_data['hasCook'],room_data['hasAirConditioner'],
                      room_data['hasWaterHeater'],room_data['hasBed'],room_data['hasWordrobe'],room_data['hasSofa'],room_data['hasToilet'],room_data['hasSmartLock'],room_data['hasVentilator'],
                      room_data['hasGasStove'],room_data['hasWifi'],room_data['traffic'],room_data['roomNum'],room_data['bathNum'],room_data['hallsNum'],
                      room_data['description'],room_data['url'],str(room_data['picUrl']),str(room_data['picPath']))

            self.curcor.execute(self.sql,data)
            self.db.commit()
            print('写入数据库成功')
        except Exception as e:
            self.db.rollback()
            print('写入数据库失败')
            print(e)
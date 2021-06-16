import pymysql
from room import RoomField
from tqdm import tqdm,trange
import time
config = {
    'db': 'house',
    'host': 'localhost',
    'user': 'root',
    'password': '123456'
}


class HouseDb:
    def __init__(self, config=config):
        self.db = config['db']
        self.host = config['host']
        self.user = config['user']
        self.password = config['password']
        # 初始化数据库连接
        self.connection = pymysql.connect(host=self.host, database=self.db, user=self.user, password=self.password)
        self.cursor = self.connection.cursor()
        self.room = RoomField()

    # 读数据
    def readData(self, sql):

        # 创建数据库游标
        try:
            self.cursor.execute(sql)
            results = self.cursor.fetchall()
            return results
        except Exception as e:
            self.connection.rollback()
            print(e)

    # 写数据
    def writeData(self, sql, data):
        try:
            self.cursor.execute(sql, data)
            self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            print(e)

    def close_resources(self):
        self.cursor.close()
        self.connection.close()


if __name__ == '__main__':
    # test = HouseDb(config=config)
    # test.readData(sql="select * from room_data where city='西安'")
    for item in tqdm(range(0,500)):
        time.sleep(0.00001)
    time.sleep(0.5)

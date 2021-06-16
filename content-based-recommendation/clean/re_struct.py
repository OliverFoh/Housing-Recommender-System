import hashlib
import time
from mysql.db import HouseDb, RoomField
import re


# 生成唯一id
def create_union_id():
    room_id = hashlib.md5(str(time.perf_counter()).encode('utf-8'))
    return room_id.hexdigest()


sql_room_detail = "insert  into room_detail values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
                  "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
                  "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
                  "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
sql_room_gen = "insert  into room_gen values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"


def extract(text):
    results = re.search(r"h(.*?)=1", text)
    return results

def extractUrl(text):
    results=re.search()

def extractNum(text):
    results = re.search(r"\d+", text)
    return results.group()


def read():
    db = HouseDb()
    room = RoomField()
    results = db.readData(sql="select * from room_data")
    room_list = []
    count = 0
    for item in results:
        # room.id = create_union_id()
        # room.title = item[0]
        # room.city = item[1]
        # room.district = item[2]
        # room.road = item[3]
        # room.community = item[4]
        # room.saveTime = item[5]
        # room.upTime = item[6]
        # room.price = item[7]
        # room.payType = item[8]
        # room.rentalMethod = item[9]
        # room.houseType = item[10]
        # room.roomType = item[11]
        # room.areaSize = extractNum(item[12])
        # room.decorateType = item[13]
        # room.ori = item[14]
        # room.floorInfo = item[15]
        # room.hasHeat = item[16]
        # room.hasTV = item[17]
        # room.hasRefrigerator = item[18]
        # room.hasWashingMachine = item[19]
        # room.hasBalcony = item[20]
        # room.hasCook = item[21]
        # room.hasAirConditioner = item[22]
        # room.hasWaterHeater = item[23]
        # room.hasBed = item[24]
        # room.hasWardrobe = item[25]
        # room.hasSofa = item[26]
        # room.hasToilet = item[27]
        # room.hasSmartLock = item[28]
        # room.hasVentilator = item[29]
        # room.hasGasStove = item[30]
        # room.hasWifi = item[31]
        # room.traffic = item[32]
        # room.roomNum = item[33]
        # room.bathNum = item[34]
        # room.hallsNum = item[35]
        # room.description = item[36]
        # room.url = item[37]
        # room.picUrl = item[38]
        # room.picPath = item[39]
        room_list = list(item)
        room_list.insert(0,create_union_id())
        room_list[13] = extractNum(room_list[13])

        # room_gen = room_list[0:6]
        # room_gen.insert(1, extract(room_list[39]).group(0))
        # # print(extract(room_list[39]).group())
        # # print(room_list[39])
        # room_gen.append(room_list[8])
        # room_gen.append(room_list[13])
        # room_gen.append(room_list[15])
        # room_gen.append(room_list[33])
        # print(room_gen)

        #print(room_list)

        db.writeData(sql_room_detail, room_list)
        count += 1
        print("插入第%s条数据" % count)
        # print(room.id + " " + room.title + " " + room.city
        #       + " " + room.community + " " + room.road)


if __name__ == '__main__':
    read()
    print()

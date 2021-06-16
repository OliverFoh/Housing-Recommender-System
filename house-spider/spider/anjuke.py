import requests
from requests.exceptions import RequestException
import re
import time
import uuid
from bs4 import BeautifulSoup
import string
import lxml
import datetime
import pymysql
import sys
import random
import threading
from fake_useragent import UserAgent
from spider.room import RoomField
from spider.city import City
from database.sqldb import DataBase
threads = []

"""
name:爬虫类
description:加载房屋对象，创建代理ip池，加载浏览器代理库
time:2021-01-10
author:oliver 
"""
class Spider:
    def __init__(self,city_list,room,db):
        self.city_list=city_list    #加载城市信息
        self.room=room      #初始化房屋对象
        self.db=db          #初始化数据库对象
        self.ua=None        #初始化ua对象
        self.db.initConnect()
    # 获取代理ip
    def getProxies(self):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
        }
        response = requests.get('http://www.89ip.cn/tqdl.html?num=100&address=&kill_address=&port=&kill_port=&isp=',
                                headers=headers)
        if response.status_code == 200:
            content = response.text
            text = BeautifulSoup(content, 'lxml')
            pattern = re.compile(r'\d+.\d+.\d+.\d+:\d+')
            number = text.find(attrs={'style': 'padding-left:20px;'})
            ipList = re.findall(pattern, str(number))
            print('成功创建ip代理池')
            print(ipList)
            return ipList

    # 获取useragent代理库
    def getUserAgent(self):
        while (True):
            try:
                self.ua = UserAgent()
                print('成功获取useragent库')
                break
            except Exception as e:
                print(e)
                print('连接useragent库出错，正在准备重新连接...')

    # 获取房屋信息页面
    def get_one_page(self,url,isPic=False):
        userAgent=self.ua.random
        headers = {
            'User-Agent': userAgent,
            }
        try:
            response = requests.get(url=url,headers=headers)
            if response.status_code == 200:
                if(isPic==True):
                    return response.content
                return response.text
        except requests.exceptions.ConnectionError:
            print("Connection refused")

    # 提取房屋信息
    def get_ifo(self,content):
        room=self.room
        soup = BeautifulSoup(content, 'lxml')
        #print(soup.find_all(attrs={'class': 'house-title'})[0].div.string)
        room['title'] = soup.find_all(attrs={'class': 'house-title'})[0].div.string
        payType=soup.find_all(attrs={'class':'full-line cf'})
        room['payType']=payType[0].find(attrs={'class':'type'}).string
        room['price'] = soup.find_all(attrs={'class': 'light'})[0].em.string
        house_text = soup.find_all(attrs={'class': 'house-info-item'})
        location_text = soup.find_all(attrs={'_soj': 'propview'})
        room['community'] = location_text[0].string  # 区、小区、路
        room['district'] = location_text[1].string
        room['road'] = location_text[2].string

        ifo = []
        for i in range(len(house_text)):  # 面积，户型，朝向，装修类型
            info_item = house_text[i].find_all(attrs={'class': 'info'})
            if (i == 0):
                string = re.sub("[A-Za-z\!\"\<\>\,\=\;\:\[\]\-\/\s]", "", str(info_item))  # 户型信息提取
                ifo.append(string)
            if (info_item and i != 0):
                ifo.append(info_item[0].string)
        room['roomType'] = ifo[0]
        room['areaSize'] = ifo[1]
        room['ori'] = ifo[2]
        room['floorInfo'] = ifo[3]
        room['decorateType'] = ifo[4]
        room['houseType'] = ifo[5]
        room_nums=re.findall('\d+',ifo[0])
        if(len(room_nums)==3):
            room['roomNum']=room_nums[0]
            room['hallsNum']=room_nums[1]
            room['bathNum']=room_nums[2]
        peitao_text = soup.find_all(attrs={'class': 'peitao-item'})  # 房屋配套信息
        peitao_list = []
        for i in range(16):
            peitao_list.append(0)
        for i in range(len(peitao_text)):
            if (peitao_text[i]['class'] == ['peitao-item', 'has']):
                peitao_list[i] = 1
        flag=0
        peitaoType=soup.find_all(attrs={'class': 'mod-title bottomed'})
        for item in peitaoType:
            if(item.h2):
                if(item.h2.string=='房屋配套'):
                    flag=1      #置赋值标记
                    room['hasRefrigerator'] = peitao_list[0]
                    room['hasWashingMachine'] = peitao_list[1]
                    room['hasWaterHeater'] = peitao_list[2]
                    room['hasWifi'] = peitao_list[3]
                    room['hasSofa'] = peitao_list[4]
                    room['hasVentilator'] = peitao_list[5]
                    room['hasGasStove'] = peitao_list[6]
                    room['hasCook'] = peitao_list[7]
                    room['hasTV'] = peitao_list[8]
                    room['hasAirConditioner'] = peitao_list[9]
                    room['hasWordrobe'] = peitao_list[10]
                    room['hasBed'] = peitao_list[11]
                    room['hasToilet'] = peitao_list[12]
                    room['hasSmartLock'] = peitao_list[13]
                    room['hasBalcony'] = peitao_list[14]
                    room['hasHeat'] = peitao_list[15]
                    break


        #print(peitaoType)
        #print(peitao_text)
        if(flag!=1):
            room['hasTV'] = peitao_list[0]
            room['hasAirConditioner'] = peitao_list[1]
            room['hasWordrobe'] = peitao_list[2]
            room['hasBed'] = peitao_list[3]
            room['hasToilet'] = peitao_list[4]
            room['hasSmartLock'] = peitao_list[5]
            room['hasBalcony'] = peitao_list[6]
            room['hasHeat'] = peitao_list[7]
            room['hasRefrigerator'] = peitao_list[8]
            room['hasWashingMachine'] = peitao_list[9]
            room['hasWaterHeater'] = peitao_list[10]
            room['hasWifi'] = peitao_list[11]
            room['hasSofa'] = peitao_list[12]
            room['hasVentilator'] = peitao_list[13]
            room['hasGasStove'] = peitao_list[14]
            room['hasCook'] = peitao_list[15]
        fabu_text=soup.find_all(attrs={'class':'right-info'})
        upTime=re.findall('b.*?>(.*?)<',str(fabu_text[0]))
        room['upTime']=upTime[0]
        pic=soup.find_all(attrs={'height':'450'})
        imageUrl=[]
        for i in range(len(pic)):
            if(pic[i].has_attr('data-src')):
                imageUrl.append(str(pic[i]['data-src']))
        room['picUrl']=str(imageUrl)

        #保存图片

        room['picPath']=self.getImage(imageUrl=imageUrl)
        rentalMethod=soup.find(class_='rent')      #租赁方式
        traffic=soup.find(class_='subway')          #交通信息
        room['rentalMethod']=rentalMethod.string
        room['traffic']=traffic.string
        description=soup.find(class_='auto-general')
        result=re.sub('<.*?>','',str(description))
        room['description']=re.sub('\n','',str(result))
        return room

    def extract_chinese(self,txt):  # 提取房东评论
        pattern = re.compile("[\u4e00-\u9fa5]")
        return "".join(pattern.findall(txt))

    #获取城市地址信息
    def get_city(self):
        return self.city_list

    # 城市网址拼接
    def split_url(self,city_list):
        for i in range(len(city_list)):
            city_list[i]['url'] = city_list[i]['url'] + str('/fangyuan/')
        return city_list

    # 获取每个城市房源信息
    def getCityInfo(self,city, sleepTime):
        base_url = city['url']
        sum = 0
        j = 1
        while (True):
            print('正在爬取第%s页'%j)
            page_url = base_url + 'p' + str(j) + '/'
            text = self.get_one_page(url=page_url)
            print(page_url)

            time.sleep(3)
            soup = BeautifulSoup(text, 'lxml')
            room_url = []
            items = soup.find_all(attrs={'class': 'zu-itemmod'})
            stopFlag = soup.find(attrs={'class': 'aNxt'})
            for m in range(len(items)):  # 获取页面中所有房源url
                # print(items[m].attrs['link'])
                room_url.append(items[m].attrs['link'])
            print('当前页面房源个数：%s'% len(room_url))
            count = 0
            house_list = []
            for item in room_url:  # 单个房源信息提取
                try:
                    print(item)
                    content = self.get_one_page(item)
                    room = self.get_ifo(content)
                    room['url'] = item
                    room['city'] = city['name']
                    room['saveTime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    print(room)
                    house_list.append(room)
                    count += 1
                    print('第：%s 条'%count)
                    self.db.insertionData(room_data=room)
                    time.sleep(random.randint(3,10))
                except Exception as e:
                    print('error')
                    print(e)
                    time.sleep(sleepTime)
                    continue
            # try:
            #     # db = pymysql.connect('127.0.0.1', 'root', 'Fswmysql', 'anjukeHouse')
            #     print('connection success!')
            # except pymysql.OperationalError as e:
            #     print(e)
            #     print('connection failed!')
            #     sys.exit(0)
            # spider_sql.wr_mysql(house_list,db)  # 写入数据库
            # db.close()

            if (stopFlag == None):  # 没有下一页时跳出
                self.db.curcor.close()  #关闭数据库连接
                self.db.db.close()
                break
            j += 1
            sum += count
            time.sleep(sleepTime)
            print('总共已爬取%d条' % sum)
    #获取房源图片
    def getImage(self,imageUrl):
        #pic=self.get_one_page(imageUrl)
        dir_list=[]
        if(len(imageUrl)>3):        #若图片大于三张，则只下载前三张
            imageUrl=imageUrl[0:3]
        for url in imageUrl:
            pic = self.get_one_page(url=url,isPic=True)
            pic_name=uuid.uuid1()       #生成随机唯一字符串作为文件名
            dir = '../pic/'+str(pic_name)+'.jpg'
            with open(dir,'wb') as fp:
                fp.write(pic)
            time.sleep(1)
            dir_list.append(str(pic_name)+'.jpg')
        print('当前房源图片下载成功')
        return dir_list
if __name__ == '__main__':
    db=DataBase(host='127.0.0.1',user='root',password='123456',database='house')
    house=RoomField()
    city=City()
    anjuke=Spider(room=house.rome,city_list=city.city_list,db=db)     #初始化房源对象
    anjuke.getUserAgent()         #加载浏览器代理库
    #获取各个城市房源分站链接
    city_init_list=anjuke.get_city()
    city_list=anjuke.split_url(city_init_list)

    #对单个城市房源进行爬取
    anjuke.getCityInfo(city=city_list[3],sleepTime=6)
    # time='2021年01月13日'
    #
    # print(time.replace('[\u4e00-\u9fa5]','-',time))

    #ipList=getProxies()
    # city_init_list=get_city()
    # city_list=split_url(city_init_list)
    # print(city_list)
    # getCityInfo(city_list[1],sleepTime=3)
    # for i in range(len(city_list)):
    #     threads.append(threading.Thread(target=getCityInfo,args=(city_list[i],random.randint(0,3))))
    # for item in threads:
    #     item.start()
        #time.sleep(random.randint(3,5))
    # for item in threads:
    #     item.join()
    # threads.clear()
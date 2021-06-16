package com.oliver.service;

import com.oliver.pojo.PageResult;
import com.oliver.pojo.Room;
import org.apache.xmlrpc.client.XmlRpcHttpTransportException;

import java.net.MalformedURLException;
import java.util.List;

public interface RoomDataService {
    //获取房源列表
    List<Room> getRoomList();

    //获取指定数量的房源
    List<Room> getRandomRoom(int count);

    //根据id获取房源
    Room getRoomById(String id);

    //根据城市获取房源
    PageResult getRoomByCity(String city, int pageNum, int pageSize);

    //根据城市、租赁方式、价格来获取房源列表
    PageResult getFilterRoom(String city,String rentalMethod,String decorateType,String houseType,String ori,String sortType,int pageNum,int pageSize);

    //获取猜你喜欢列表
    List<Room> getRecommendRooms(String city,String roomId) throws MalformedURLException, XmlRpcHttpTransportException;

    //搜索栏模糊查询房源
    PageResult queryRooms(String queryString,int pageNum,int pageSize);
}

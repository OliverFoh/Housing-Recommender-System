package com.oliver.serviceImpl;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.oliver.dao.RoomMapper;
import com.oliver.pojo.PageResult;
import com.oliver.pojo.Room;
import com.oliver.service.RoomDataService;
import com.oliver.utils.PageUtil;
import com.oliver.utils.PicUrlResolve;
import com.oliver.utils.PythonRpc;
import com.oliver.utils.RedisUtil;
import org.apache.xmlrpc.client.XmlRpcHttpTransportException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.List;

@Service
public class RoomDataServiceImpl implements RoomDataService{
    @Autowired
    private RoomMapper roomMapper;
    @Autowired
    private RedisUtil redisUtil;

    @Override
    public List<Room> getRoomList() {
        System.out.println("进入service方法");
        List<Room> roomList =null;

        return roomList;
    }

    @Override
    public Room getRoomById(String id) {
        Room room = roomMapper.selectById(id);
        room.setImage(PicUrlResolve.extractImageList(room.getPicUrl()));
        System.out.println(room);
        return room;
    }

    @Override
    public List<Room> getRandomRoom(int count) {
        List<Room> rooms = roomMapper.getRandomRoom(count);
        for (int i = 0; i < rooms.size(); i++) {        //提取房源缩略图
            rooms.get(i).setCover(PicUrlResolve.extractCoverImage(rooms.get(i).getPicUrl()));
        }
        return rooms;
    }

    @Override
    public PageResult getRoomByCity(String city, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        List<Room> roomList = roomMapper.selectByCity(city);
        for (int i = 0; i < roomList.size(); i++) {
            roomList.get(i).setCover(PicUrlResolve.extractCoverImage(roomList.get(i).getPicUrl()));
//            roomList.get(i).setPicUrl(null);
//            roomList.get(i).setDescription(null);
        }
        PageInfo<Room> roomPageInfo = new PageInfo<>(roomList);
        return PageUtil.getPageResult(roomList,roomPageInfo);
//        return roomPageInfo.getList();
    }

    @Override
    public PageResult getFilterRoom(String city, String rentalMethod,String decorateType,String houseType,String ori, String sortType, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        System.out.println("**********查找条件*********");
        System.out.println("城市："+city);
        System.out.println("租赁方式："+rentalMethod);
        System.out.println("排序方式："+sortType);
        System.out.println("装修方式："+decorateType);
        System.out.println("住宅类型："+houseType);
        System.out.println("朝向："+ori);
        System.out.println("*******************");
        List<Room> roomList=roomMapper.getRoomByConditions(city, rentalMethod,  decorateType, houseType, ori,sortType);
        for (int i = 0; i < roomList.size(); i++) {
            roomList.get(i).setCover(PicUrlResolve.extractCoverImage(roomList.get(i).getPicUrl()));
            roomList.get(i).setPicUrl(null);
            roomList.get(i).setDescription(null);
        }
        PageInfo<Room> roomPageInfo = new PageInfo<>(roomList);
        return PageUtil.getPageResult(roomList,roomPageInfo);
    }

    @Override
    public List<Room> getRecommendRooms(String city, String roomId) throws MalformedURLException, XmlRpcHttpTransportException {
        List<String> roomIdList=null;
        if(redisUtil.exists(roomId)){       //判断该房源推荐列表是否已经在redis中缓存过
            System.out.println("已经在redis中缓存过");
            roomIdList=redisUtil.getList(roomId);
        }else {
            System.out.println("第一次推荐，未缓存");
            roomIdList=PythonRpc.generateSimilarityList(city, roomId);
            //推荐列表缓存进redis
            redisUtil.setList(roomId,roomIdList);
        }

        System.out.println("相似度列表为："+roomIdList);

        List<Room> roomList = roomMapper.batchSelect(roomIdList);
        for (int i = 0; i < roomList.size(); i++) {
            roomList.get(i).setCover(PicUrlResolve.extractCoverImage(roomList.get(i).getPicUrl()));
            roomList.get(i).setPicUrl(null);
        }
        System.out.println(roomList);
        return roomList;
    }

    @Override
    public PageResult queryRooms(String queryString,int pageNum,int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        System.out.println("**********查找条件*********");
        System.out.println(queryString);
        System.out.println("*******************");
        List<Room> roomList = roomMapper.searchRoomByQueryString(queryString);
//        List<Room> roomList=roomMapper.getRoomByConditions(city, rentalMethod,  decorateType, houseType, ori,sortType);
        for (int i = 0; i < roomList.size(); i++) {
            roomList.get(i).setCover(PicUrlResolve.extractCoverImage(roomList.get(i).getPicUrl()));
            roomList.get(i).setPicUrl(null);
        }
        PageInfo<Room> roomPageInfo = new PageInfo<>(roomList);
        return PageUtil.getPageResult(roomList,roomPageInfo);
    }
}

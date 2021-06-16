package com.oliver.controller;


import com.fasterxml.jackson.annotation.JsonView;
import com.oliver.pojo.PageResult;
import com.oliver.pojo.Room;
import com.oliver.service.RoomDataService;
import com.oliver.serviceImpl.RoomDataServiceImpl;
import org.apache.ibatis.annotations.Param;
import org.apache.xmlrpc.client.XmlRpcHttpTransportException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping(value = "/room")
public class RoomDataController {

    @Autowired
    private RoomDataServiceImpl roomDataService;

    @RequestMapping(value = "/getRoomList")
    @JsonView(Room.RoomSimpleView.class)
    public List<Room> getRoomList(){
        return roomDataService.getRoomList();
    }

    /**
     * 根据id获取房源详情信息
     * @param id
     * @return
     */
    @GetMapping(value = "/getRoomById/{id}")
    @JsonView(Room.RoomDetailView.class)
    public Room getRoomById(@PathVariable("id")String id){
        return roomDataService.getRoomById(id);
    }

    /**
     * 随机获取房源信息
     * @param count
     * @return
     */
    @RequestMapping(value = "/getRandomRoom/{count}")
    @JsonView(Room.RoomSimpleView.class)
    public List<Room> getRandomRoom(@PathVariable("count") int count){
        return roomDataService.getRandomRoom(count);
    }

    /**
     * 根据城市筛选房源
     * @param city
     * @return
     */
    @RequestMapping(value = "/getRoomByCity",method = RequestMethod.GET)
    public PageResult getRoomByCity(@RequestParam("city")String city,
                                    @RequestParam("pageNum")int pageNum,
                                    @RequestParam("pageSize")int pageSize){
        return roomDataService.getRoomByCity(city,pageNum,pageSize);
    }

    /**
     * 根据城市、租赁方式、价格排序等筛选条件来筛选房屋
     * @param city
     * @param rentalMethod
     * @param sortType
     * @return
     */
    @RequestMapping(value = "/getFilterRoom",method = RequestMethod.POST)
    //@JsonView(Room.RoomSimpleView.class)
    public PageResult getFilterRoom(@RequestParam(name = "city",defaultValue = "北京")String city,
                                           @RequestParam(name = "rentalMethod",required = false)String rentalMethod,
                                           //@RequestParam(name = "district",required = false)String district,
                                           @RequestParam(name = "decorateType",required = false)String decorateType,
                                           @RequestParam(name = "houseType",required = false)String houseType,
                                           @RequestParam(name = "ori",required = false)String ori,
                                           @RequestParam(name = "price",required = false)String sortType,
                                           @RequestParam(name = "pageNum",defaultValue = "0")int pageNum,
                                           @RequestParam(name = "pageSize",defaultValue = "5")int pageSize){
        return roomDataService.getFilterRoom(city, rentalMethod, decorateType, houseType, ori, sortType, pageNum, pageSize);
    }

    /**
     * 获取推荐列表（返回top5相似度房源）
     * @param city
     * @param roomId
     * @return
     */
    @RequestMapping(value = "/getRecommendList",method = RequestMethod.GET)
    public List<Room> getRecommends(@RequestParam(name = "city")String city,
                                    @RequestParam(name = "roomId")String roomId) throws MalformedURLException, XmlRpcHttpTransportException {
        System.out.println("city:"+city);
        System.out.println("roomId:"+roomId);
        return roomDataService.getRecommendRooms(city, roomId);
    }

    /**
     * 模糊查询房源
     * @param queryString
     * @return
     */
    @RequestMapping(value = "searchByQueryStr",method = RequestMethod.POST)
    public PageResult searchRooms(@RequestParam(name = "query")String queryString,
                                  @RequestParam(name = "pageNum",defaultValue = "0")int pageNum,
                                  @RequestParam(name = "pageSize",defaultValue = "5")int pageSize){
        return roomDataService.queryRooms(queryString, pageNum, pageSize);
    }
}

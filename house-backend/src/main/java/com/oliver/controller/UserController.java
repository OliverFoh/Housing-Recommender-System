package com.oliver.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonView;
import com.oliver.pojo.*;
import com.oliver.service.UserService;
import com.oliver.serviceImpl.UserServiceImpl;
import com.oliver.utils.UserOpenIdResolver;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @PostMapping(value = "/addUser")
    public void addUser(User user){
        userService.addUser(user);
    }

    @GetMapping(value = "/selectUser")
    public User selectUserById(String openId){
        return userService.selectUser(openId);
    }

    /**
     * 用户登陆
     * @param code
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/login")
    public String loginUser(@RequestParam(name = "code")String code)throws Exception{
        User user = new User();
        String openId=UserOpenIdResolver.getOpenIdFromWx(code);
//        user.setOpenId(openId);
//        userService.addUser(user);
        return openId;
    }

    /**
     * 添加房源到用户收藏
     * @param openId
     * @param roomId
     * @return
     */
    @RequestMapping(value = "/userLike",method = RequestMethod.POST)
    public Boolean addUserLike(@RequestParam("openId")String openId, @RequestParam("roomId")String roomId){
        UserLike userLike = new UserLike();
        userLike.setRoomId(roomId);
        userLike.setOpenId(openId);
        return userService.addUserLike(userLike);

    }

    /**
     * 获取用户收藏
     * @param openId
     * @return
     */
    @RequestMapping(value = "/userLike",method = RequestMethod.GET)
    //@JsonView(Room.RoomSimpleView.class)
    public List<Room> selectUserLike(@RequestParam("openId")String openId){
        System.out.println("获取用户收藏");
        return userService.selectUserLike(openId);

    }

    /**
     * 删除收藏的房源
     * @param roomId
     * @return
     */
    @RequestMapping(value = "/cancelUserLike",method = RequestMethod.POST)
    public Boolean cancelUserLike(@RequestParam(name = "roomId") String roomId,
                                  @RequestParam(name = "openId")String openId){
        return userService.deleteUserLike(roomId,openId);
    }

    /**
     * 添加用户浏览记录
     * @param roomId
     * @param openId
     * @return
     */
    @RequestMapping(value = "/logInHistory",method = RequestMethod.POST)
    public Boolean logInHistory(@RequestParam(name = "roomId")String roomId,
                                @RequestParam(name = "openId")String openId){
        return userService.logInHistory(roomId, openId);

    }

    /**
     * 获取用户浏览记录
     * @param openId
     * @param pageNum
     * @param pageSize
     * @return
     */
    @RequestMapping(value = "/getUserHistory",method = RequestMethod.POST)
    public PageResult getUserHistory(@RequestParam(name = "openId")String openId,
                                     @RequestParam(name = "pageNum")int pageNum,
                                     @RequestParam(name = "pageSize")int pageSize){
       return userService.getUserHistory(openId, pageNum, pageSize);

    }
}

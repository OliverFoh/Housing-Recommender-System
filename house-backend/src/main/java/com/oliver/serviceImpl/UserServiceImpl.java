package com.oliver.serviceImpl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.oliver.dao.UserMapper;
import com.oliver.pojo.*;
import com.oliver.service.UserService;
import com.oliver.utils.PageUtil;
import com.oliver.utils.PicUrlResolve;
import com.oliver.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public User selectUser(String id) {
        return userMapper.selectUserById(id);
    }

    @Override
    public void addUser(User user) {
        user.setNickName(null);
        user.setLastLogin(null);
        user.setRegisterTime(null);
        userMapper.addUser(user);
    }

    @Override
    public boolean addUserLike(UserLike userLike) {
        Date date = new Date();
        userLike.setAddTime(new java.sql.Date(date.getTime()));
        try {
            return userMapper.addUserLike(userLike);
        }catch (Exception e){
            //e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Room> selectUserLike(String openId) {
        List<Room> rooms =userMapper.selectUserLikeById(openId);
        for (int i = 0; i < rooms.size(); i++) {        //提取房源缩略图
            rooms.get(i).setCover(PicUrlResolve.extractCoverImage(rooms.get(i).getPicUrl()));
            rooms.get(i).setImage(PicUrlResolve.extractImageList(rooms.get(i).getPicUrl()));
        }
        return rooms;
    }

    @Override
    public Boolean deleteUserLike(String roomId,String openId) {
        try {
            return userMapper.deleteUserLike(roomId,openId);
        }catch (Exception e) {
            //e.printStackTrace();
            return false;
        }
    }

    /**
     * 存储用户浏览记录
     * @param roomId
     * @param openId
     * @return
     */
    @Override
    public Boolean logInHistory(String roomId, String openId) {
        BrowseHistory browseHistory = new BrowseHistory();
        Date date = new Date();
        browseHistory.setOpenId(openId);
        browseHistory.setRoomId(roomId);
        browseHistory.setBrowseTime(new java.sql.Date(date.getTime()));
        try {
            return userMapper.logInHistory(browseHistory);
        }catch (Exception e){
            //e.printStackTrace();
            return false;
        }
    }

    /**
     * 获取用户浏览记录
     * @param openId
     * @param pageNum
     * @param pageSize
     * @return
     */


    @Override
    public PageResult getUserHistory(String openId,int pageNum,int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<Room> roomList = userMapper.selectUserHistory(openId);
        for (int i = 0; i < roomList.size(); i++) {
            roomList.get(i).setCover(PicUrlResolve.extractCoverImage(roomList.get(i).getPicUrl()));
            roomList.get(i).setPicUrl(null);
        }
        PageInfo<Room> roomPageInfo = new PageInfo<>(roomList);

        //查询缓存中是否存在
//        boolean hasKey = redisUtils.exists(id);
//        redisUtils.set("test","success");
//        System.out.println(redisUtils.get("test").toString());
//        String str = "";
//        if(hasKey){
//            //获取缓存
//            Object object =  redisUtils.get(id);
//
//            str = object.toString();
//            System.out.println("缓存值为："+str);
//        }else{
//            System.out.println("redis缓存中不存在");
//            //从数据库中获取信息
//            log.info("从数据库中获取数据");
//            str = testService.test();
//            //数据插入缓存（set中的参数含义：key值，user对象，缓存存在时间10（long类型），时间单位）
//            redisUtils.set(id,str,10L,TimeUnit.MINUTES);
//            log.info("数据插入缓存" + str);
//        }
        return PageUtil.getPageResult(roomList,roomPageInfo);
    }
}

package com.oliver.service;

import com.oliver.pojo.PageResult;
import com.oliver.pojo.Room;
import com.oliver.pojo.User;
import com.oliver.pojo.UserLike;

import java.util.List;

public interface UserService {
    /**
     * 根据id获取用户信息
     * @param id
     * @return
     */
    User selectUser(String id);

    /**
     * 添加新用户
     * @param user
     */
    void addUser(User user);

    /**
     * 用户收藏添加
     * @param userLike
     * @return
     */
    boolean addUserLike(UserLike userLike);

    /**
     * 查询用户收藏的房源
     * @param openId
     * @return
     */
    List<Room> selectUserLike(String openId);

    /**
     * 删除用户收藏的房源
     * @param roomId
     * @param openId
     * @return
     */
    Boolean deleteUserLike(String roomId,String openId);

    /**
     * 记录用户浏览历史
     * @param roomId
     * @param openId
     * @return
     */
    Boolean logInHistory(String roomId,String openId);

    /**
     * 获取用户浏览历史
     * @param openId
     * @return
     */
    PageResult getUserHistory(String openId,int pageNum,int pageSize);
}

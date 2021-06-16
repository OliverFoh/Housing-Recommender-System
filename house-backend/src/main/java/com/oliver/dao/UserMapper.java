package com.oliver.dao;


import com.oliver.pojo.BrowseHistory;
import com.oliver.pojo.Room;
import com.oliver.pojo.User;
import com.oliver.pojo.UserLike;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
@Mapper
@Repository
public interface UserMapper {
    @Insert("insert into user(open_id,nick_name,register_time,last_login) values(#{openId},#{nickName},#{registerTime},#{lastLogin})")
    Boolean addUser(User user);

    @Delete("delete from user where open_id=#{id}")
    Boolean deleteUser(String id);

    @Select("select * from user where open_id=#{id}")
    User selectUserById(String id);

    @Insert("insert into user_like(room_id,open_id,add_time) values(#{roomId},#{openId},#{addTime})")
    Boolean addUserLike(UserLike userLike);

    @Select("SELECT id,title,city,district,price,ori,room_type,house_type,rental_method,pic_url,add_time FROM room,user_like WHERE room.id=user_like.room_id AND user_like.open_id=#{openId} ORDER BY add_time DESC;")
    List<Room> selectUserLikeById(String openId);

    @Delete("delete from user_like where room_id=#{roomId} and open_id=#{openId}")
    Boolean deleteUserLike(String roomId,String openId);

    @Insert("insert into browse_history(room_id,user_id,browse_time) values(#{roomId},#{openId},#{browseTime})")
    Boolean logInHistory(BrowseHistory browseHistory);

    @Select("SELECT id,title,city,district,price,ori,room_type,house_type,rental_method,pic_url,browse_time FROM room,browse_history WHERE room.id=browse_history.room_id AND browse_history.user_id=#{openId} ORDER BY browse_time DESC")
    List<Room> selectUserHistory(String openId);
}

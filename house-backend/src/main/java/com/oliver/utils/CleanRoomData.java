package com.oliver.utils;

import javax.sql.DataSource;
import java.sql.*;

public class CleanRoomData {
    private static Connection connection;
    //139.155.47.88
    public static Connection getConnection(){
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection= DriverManager.getConnection("jdbc:mysql://localhost:3306/house?serverTimezone=UTC&useSSL=false",
                    "root","123456");
            System.out.println("数据库连接成功");
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }

    public static void main(String[] args) throws SQLException {
        Connection connection = CleanRoomData.getConnection();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery("select title,city,title, city, district, road,community,price from room_data");
        while (resultSet.next()){
//            int id = resultSet.getInt("id");
//            String name = resultSet.getString("name");
//            String pwd = resultSet.getString("pwd");
//            System.out.println(id+name+pwd);
            //resultSet.getObject()
            System.out.println(resultSet.getString("title")+" "+resultSet.getString("city")
                    +" "+resultSet.getString("road")
                    +" "+resultSet.getString("community")
                    +" "+resultSet.getString("price"));
        }
        statement.close();
        connection.close();
    }
}

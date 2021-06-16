package com.oliver.utils;

import java.net.URL;
import java.net.MalformedURLException;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.xmlrpc.XmlRpcException;
import org.apache.xmlrpc.client.XmlRpcClient;
import org.apache.xmlrpc.client.XmlRpcClientConfigImpl;
import org.apache.xmlrpc.client.XmlRpcHttpTransportException;

/**
 * RPC客户端，远程调用python语言实现的算法模型
 */
public class PythonRpc {
    public static List<String> generateSimilarityList(String city,String roomId) throws MalformedURLException, XmlRpcHttpTransportException{
        List<String> similarityList=null;
        XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
        config.setServerURL(new URL("http://127.0.0.1:8061/RPC2"));
        XmlRpcClient client = new XmlRpcClient();
        client.setConfig(config);
        // 根据不同的python函数形式，构造参数
        // 两个整形参数
        //Object[] params = new Object[] {new Integer(1), new Integer(2)};

        // 单个字符串参数
        Object[] params = new Object[] {new String(city),new String(roomId)};

        // 无参数
        //Object[] params = null;
        try {
            // 返回的结果是字符串类型，强制转换res为String类型
            String res = (String) client.execute("get_similarity_list", params);
            JSONObject jsonObject = JSON.parseObject(res);
            System.out.println(jsonObject.get("similarity_rooms"));
            similarityList=(List<String>) jsonObject.get("similarity_rooms");
            return similarityList;
        } catch (Exception e11) {
            e11.printStackTrace();
        }
        return null;
    }
}
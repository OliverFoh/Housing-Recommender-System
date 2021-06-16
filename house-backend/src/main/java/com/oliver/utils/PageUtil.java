package com.oliver.utils;

import com.github.pagehelper.PageInfo;
import com.oliver.pojo.PageResult;

import java.util.List;

public class PageUtil {
    /**
     * 生成pageResult工具类
     * @param dataList
     * @param pageInfo
     * @return
     */
    public static PageResult getPageResult(List<?> dataList, PageInfo<?> pageInfo){
        PageResult pageResult = new PageResult();
        pageResult.setContent(dataList);
        pageResult.setPageNum(pageInfo.getPageNum());
        pageResult.setPageSize(pageInfo.getPageSize());
        pageResult.setTotalSize(pageInfo.getTotal());
        pageResult.setTotalPages(pageInfo.getPages());
        return pageResult;
    }
}

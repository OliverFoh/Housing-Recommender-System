class City:
    def __init__(self):
        self.city_list = [{'name': '西安', 'url': 'https://xa.zu.anjuke.com'},  # 西安
                          {'name': '北京', 'url': 'https://bj.zu.anjuke.com'},  # 北京
                          {'name': '广州', 'url': 'https://gz.zu.anjuke.com'},  # 广州
                          {'name': '深圳', 'url': 'https://sz.zu.anjuke.com'},  # 深圳
                          {'name': '上海', 'url': 'https://sh.zu.anjuke.com'}]  # 上海

    def getSingleCity(self,index):      #获取单个城市
        return self.city_list[index]
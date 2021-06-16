from xmlrpc.server import SimpleXMLRPCServer
from socketserver import ThreadingMixIn

from xmlrpc.client import ServerProxy
from algrithom.one_hot_code import SimilarityAlgorithm

import threading
import json


class ThreadXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
    pass


class RPCServer():
    def __init__(self, ip='127.0.0.1', port='8000'):
        self.ip = ip
        self.port = int(port)
        self.svr = None

    def start(self, func_lst):
        threading.start_new_thread(self.service, (func_lst, 0,))

    def resume_service(self, v1, v2):
        self.svr.serve_forever(poll_interval=0.001)

    def service(self, func_lst, v1):
        self.svr = ThreadXMLRPCServer((self.ip, self.port), allow_none=True)
        for func in func_lst:
            self.svr.register_function(func)
        self.svr.serve_forever(poll_interval=0.001)

    def activate(self):
        threading.start_new_thread(self.resume_service, (0, 0,))

    def shutdown(self):
        try:
            self.svr.shutdown()
        except Exception as e:
            print(e)
            # print('rpc_server shutdown:', str(e))


class RPCClient():
    def __init__(self, ip='127.0.0.1', port='8000'):
        self.svr = ServerProxy('http://' + ip + ':' + port + '/', allow_none=True, use_datetime=True)

    def get_svr(self):
        return self.svr


def get_similarity_list(city,room_id):
    # 初始化算法模型
    similarity = SimilarityAlgorithm(file_name="room.csv", city=city, room_id=room_id)
    similarity_rooms = similarity.calculateSimilarity()
    res_data = {
        'similarity_rooms': similarity_rooms
    }
    return json.dumps(res_data)


if __name__ == "__main__":
    print('RPC服务已启动')
    r = RPCServer('0.0.0.0', '8061')
    r.service([get_similarity_list], 0)  # 这里仅仅载入get_similarity_list函数


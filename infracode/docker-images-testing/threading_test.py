from threading import Thread
from time import sleep

def threaded_function(arg):
    for i in range(arg):
        print("running")
        sleep(1)


if __name__ == "__main__":
    thread = Thread(target = threaded_function, args = (10, ))
    thread.start()
    for i in [200, 400, 600, 800, 1000]:
        print(i)
        sleep(1)
    print('Done with unthreaded execuitiuon')
    thread.join()
    print("thread finished...exiting")
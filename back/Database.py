import mysql.connector

class Database:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.conn = None
        self.cursor = None
        self.connect()

    def connect(self):
        self.conn = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )
        self.cursor = self.conn.cursor()

    def reconnect(self):
        if self.conn is None or not self.conn.is_connected():
            self.connect()
        else:
            self.cursor = self.conn.cursor()

    def execute_query(self, query, params):
        self.reconnect()
        self.cursor.execute(query, params)
        self.conn.commit()

    def fetch_all(self, query):
        self.reconnect()
        self.cursor.execute(query)
        return self.cursor.fetchall()
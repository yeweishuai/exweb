package comm

import (
    "time"

    "github.com/kataras/iris/mvc"
    "github.com/kataras/iris/sessions"
)

type DBConfig struct {
    DBUser              string  `toml:"DBUser"`
    DBPass              string  `toml:"DBPass"`
    DBName              string  `toml:"DBName"`
}

type GlobalConfig struct {
    DbConf              DBConfig    `toml:"DbConf"`
    UserConf            map[string]string   `toml:"UserConf"`
}

var (
    GConf              GlobalConfig

    CookieName4Session  =   "iriscname4ss"
    GSession            =   sessions.New(sessions.Config{
            Cookie: CookieName4Session,
            AllowReclaim: true,
            Expires: 14 * time.Minute,
            })
)

var (
    StrUserLogin        = "/user/login"
    PathIndex           =   mvc.Response{Path: "/"}
    PathUserLogin       =   mvc.Response{Path: StrUserLogin}

    IndexView           =   mvc.View{Name: "/index.html"}
    UserLoginView       =   mvc.View{Name: "/page/login/login.html"}
)

var (
    UsernameKey         = "username"
    UserpassKey         = "password"
    OrderTypeMap        = make(map[int]string)
    StatusMap           = make(map[int]string)
    SonStatusMap        = make(map[int]string)
)

const (
    OrderBuyThenSell            =   1
    OrderSellThenBuy            =   2

    StatusSonOrderCreated           = 0
    StatusSonOrderMade              = 1
    StatusSonOrderDealt             = 2
    StatusSonOrderMannualyUndo      = 3
    StatusSonOrderFinish            = 4
)


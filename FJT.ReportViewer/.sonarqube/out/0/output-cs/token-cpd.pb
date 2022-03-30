å
LD:\Development\FJT\FJT-DEV\FJT.ReportViewer\AppSettings\ConnectionStrings.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
AppSettings &
{ 
public 

class 
ConnectionStrings "
{		 
public

 
string

 
DefaultConnection

 '
{

( )
get

* -
;

- .
set

/ 2
;

2 3
}

4 5
public 
string 
ReportConnection &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
} 
} ◊
GD:\Development\FJT\FJT-DEV\FJT.ReportViewer\AppSettings\ConstantPath.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
AppSettings &
{ 
public 

class 
ConstantPath 
{		 
public

 
string

 
ReportApiURL

 "
{

# $
get

% (
;

( )
set

* -
;

- .
}

/ 0
public 
string 
	UiPageUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
IdentityserverURL '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
APIURL 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
RoHSImagesPath $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} ≠
OD:\Development\FJT\FJT-DEV\FJT.ReportViewer\AppSettings\IdentityserverConfig.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
AppSettings &
{ 
public 

class  
IdentityserverConfig %
{		 
public

 
string

 
ClientId

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
string 
ClientSecret "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string  
AuthenticationScheme *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
} 
} ¡
HD:\Development\FJT\FJT-DEV\FJT.ReportViewer\AppSettings\MongoDBConfig.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
AppSettings &
{ 
public 

class 
MongoDBConfig 
{		 
public

 
string

 #
MongoDBConnectionString

 -
{

. /
get

0 3
;

3 4
set

5 8
;

8 9
}

: ;
public 
string 
DBName 
{ 
get "
;" #
set$ '
;' (
}) *
public 
MongoCollections 
MongoCollections  0
{1 2
get3 6
;6 7
set8 ;
;; <
}= >
} 
public 

class 
MongoCollections !
{ 
public 
string (
DynamicMessageCollectionName 2
{3 4
get5 8
;8 9
set: =
;= >
}? @
} 
} ë
ND:\Development\FJT\FJT-DEV\FJT.ReportViewer\Controllers\AuthorizeController.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Controllers &
{ 
[ 
AllowAnonymous 
] 
public 

class 
AuthorizeController $
:% &

Controller' 1
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
public 
AuthorizeController "
(" #"
IDynamicMessageService# 9!
dynamicMessageService: O
)O P
{ 	"
_dynamicMessageService "
=# $!
dynamicMessageService% :
;: ;
} 	
public 
async 
Task 
< 
IActionResult '
>' (
AccessDenied) 5
(5 6
)6 7
{ 	
var 
accessDeniedMSG 
=  !
await" '"
_dynamicMessageService( >
.> ?
Get? B
(B C
POPUP_ACCESS_DENIEDC V
)V W
;W X
return 
View 
( 
$str 
,  
new! $
ErrorViewModel% 3
{4 5

StatusCode6 @
=A B
(C D
intD G
)G H
APIStatusCodeH U
.U V
ACCESS_DENIEDV c
,c d
Messagee l
=m n
stringo u
.u v
Formatv |
(| }
accessDeniedMSG	} å
.
å ç
message
ç î
,
î ï
	REQUESTED
ñ ü
)
ü †
}
° ¢
)
¢ £
;
£ §
} 	
public 
IActionResult 
Error "
(" #
ErrorViewModel# 1
errorViewModel2 @
)@ A
{ 	
return   
View   
(   
$str   
,    
errorViewModel  ! /
)  / 0
;  0 1
}!! 	
}"" 
}## º
[D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Controllers\CheckApplicationStatusController.cs
	namespace		 	
FJT		
 
.		 
ReportViewer		 
.		 
Controllers		 &
{

 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class ,
 CheckApplicationStatusController 1
:2 3
ControllerBase4 B
{ 
[ 	
HttpGet	 
] 
public 
IEnumerable 
< 
string !
>! "
Get# &
(& '
)' (
{ 	
return 
new 
string 
[ 
] 
{  !
$str" *
,* +
$str, 4
}5 6
;6 7
} 	
} 
} õÑ
WD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Controllers\CustomAuthorizationAttribute.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Controllers &
{ 
public 

class (
CustomAuthorizationAttribute -
:. /!
ActionFilterAttribute0 E
{ 
public 
override 
void 
OnActionExecuted -
(- .!
ActionExecutedContext. C
filterContextD Q
)Q R
{ 	
CustomClaim 
( 
$str *
,* +
filterContext, 9
.9 :
	RouteData: C
)C D
;D E
}   	
public"" 
override"" 
async"" 
Task"" ""
OnActionExecutionAsync""# 9
(""9 :"
ActionExecutingContext"": P
filterContext""Q ^
,""^ _#
ActionExecutionDelegate""` w
next""x |
)""| }
{## 	
var%% 
accessToken%% 
=%% 
await%% #
filterContext%%$ 1
.%%1 2
HttpContext%%2 =
.%%= >
GetTokenAsync%%> K
(%%K L
$str%%L Z
)%%Z [
;%%[ \
bool&& 
	isApiCall&& 
=&& 
false&& "
;&&" #
if(( 
((( 
accessToken(( 
==(( 
null(( #
)((# $
{)) 
var** 
urlPath** 
=** 
string** $
.**$ %
Empty**% *
;*** +
string,, 
authorizationToken,, )
=,,* +
filterContext,,, 9
.,,9 :
HttpContext,,: E
.,,E F
Request,,F M
.,,M N
Headers,,N U
[,,U V
$str,,V e
],,e f
;,,f g
if.. 
(.. 
filterContext.. !
...! "
HttpContext.." -
...- .
Request... 5
...5 6
Path..6 :
...: ;
HasValue..; C
)..C D
{// 
urlPath00 
=00 
filterContext00 +
.00+ ,
HttpContext00, 7
.007 8
Request008 ?
.00? @
Path00@ D
.00D E
Value00E J
;00J K
if11 
(11 
urlPath11 
.11  
Contains11  (
(11( )
$str11) .
)11. /
)11/ 0
{22 
	isApiCall33 !
=33" #
true33$ (
;33( )
}44 
}55 
if77 
(77 
authorizationToken77 &
==77' )
null77* .
)77. /
{88 
filterContext99 !
.99! "
Result99" (
=99) *
new99+ .!
RedirectToRouteResult99/ D
(99D E
new99E H 
RouteValueDictionary99I ]
(99] ^
new99^ a
{:: 

controller;; "
=;;# $
filterContext;;% 2
.;;2 3
	RouteData;;3 <
.;;< =
Values;;= C
[;;C D
$str;;D P
];;P Q
,;;Q R
action<< 
=<<  
filterContext<<! .
.<<. /
	RouteData<</ 8
.<<8 9
Values<<9 ?
[<<? @
$str<<@ H
]<<H I
,<<I J
id== 
=== 
filterContext== *
.==* +
	RouteData==+ 4
.==4 5
Values==5 ;
[==; <
$str==< @
]==@ A
}>> 
)>> 
)>> 
;>> 
}?? 
else@@ 
{AA 
stringBB 
[BB 
]BB 
authorsListBB (
=BB) *
authorizationTokenBB+ =
.BB= >
SplitBB> C
(BBC D
$strBBD G
)BBG H
;BBH I
accessTokenCC 
=CC  !
authorsListCC" -
[CC- .
$numCC. /
]CC/ 0
;CC0 1
}DD 
}EE 
ifGG 
(GG 
accessTokenGG 
!=GG 
nullGG #
)GG# $
{HH 
varII 
userIdII 
=II 
filterContextII *
.II* +
HttpContextII+ 6
.II6 7
UserII7 ;
.II; <
ClaimsII< B
.IIB C
CountIIC H
(IIH I
)III J
!=IIK M
$numIIN O
?IIP Q
filterContextIIR _
.II_ `
HttpContextII` k
.IIk l
UserIIl p
.IIp q
	FindFirstIIq z
(IIz {

ClaimTypes	II{ Ö
.
IIÖ Ü
NameIdentifier
IIÜ î
)
IIî ï
.
IIï ñ
Value
IIñ õ
:
IIú ù
null
IIû ¢
;
II¢ £
HttpClientHandlerKK !
handlerKK" )
=KK* +
newKK, /
HttpClientHandlerKK0 A
{LL 5
)ServerCertificateCustomValidationCallbackMM =
=MM> ?
(MM@ A
httpRequestMessageMMA S
,MMS T
certMMU Y
,MMY Z
cetChainMM[ c
,MMc d
policyErrorsMMe q
)MMq r
=>MMs u
{MMv w
returnMMx ~
true	MM É
;
MMÉ Ñ
}
MMÖ Ü
}NN 
;NN 

HttpClientQQ 
clientQQ !
=QQ" #
StartupQQ$ +
.QQ+ ,
islocalhostQQ, 7
?QQ8 9
newQQ: =

HttpClientQQ> H
(QQH I
handlerQQI P
)QQP Q
:QQR S
newQQT W

HttpClientQQX b
(QQb c
)QQc d
;QQd e
clientTT 
.TT !
DefaultRequestHeadersTT ,
.TT, -
AuthorizationTT- :
=TT; <
newTT= @%
AuthenticationHeaderValueTTA Z
(TTZ [
$strTT[ c
,TTc d
accessTokenTTe p
)TTp q
;TTq r
varVV 
	urlstringVV 
=VV 
StartupVV  '
.VV' (
IdentityServerURLVV( 9
+VV: ;
ConstantHelperVV< J
.VVJ K,
 VALIDATE_CLIENT_USER_MAPPING_URLVVK k
;VVk l
varWW 
objWW 
=WW 
newWW 
{WW 
UserIdWW  &
=WW' (
userIdWW) /
,WW/ 0
ClaimWW1 6
=WW7 8
StartupWW9 @
.WW@ A
ClientIdWWA I
}WWJ K
;WWK L
varYY 
jsonYY 
=YY 
JsonConvertYY &
.YY& '
SerializeObjectYY' 6
(YY6 7
objYY7 :
)YY: ;
;YY; <
StringContentZZ 
dataZZ "
=ZZ# $
newZZ% (
StringContentZZ) 6
(ZZ6 7
jsonZZ7 ;
,ZZ; <
EncodingZZ= E
.ZZE F
UTF8ZZF J
,ZZJ K
$strZZL ^
)ZZ^ _
;ZZ_ `
var\\ 
response\\ 
=\\ 
await\\ $
client\\% +
.\\+ ,
	PostAsync\\, 5
(\\5 6
	urlstring\\6 ?
,\\? @
data\\A E
)\\E F
;\\F G
var]] 
responseModelString]] '
=]]( )
await]]* /
response]]0 8
.]]8 9
Content]]9 @
.]]@ A
ReadAsStringAsync]]A R
(]]R S
)]]S T
;]]T U
var^^ 
apiResponse^^ 
=^^  !
(^^" #
ApiResponse^^# .
)^^. /
(^^/ 0
(^^0 1

Newtonsoft^^1 ;
.^^; <
Json^^< @
.^^@ A
Linq^^A E
.^^E F
JObject^^F M
)^^M N

Newtonsoft^^N X
.^^X Y
Json^^Y ]
.^^] ^
JsonConvert^^^ i
.^^i j
DeserializeObject^^j {
(^^{ | 
responseModelString	^^| è
)
^^è ê
)
^^ê ë
.
^^ë í
ToObject__  
(__  !
typeof__! '
(__' (
ApiResponse__( 3
)__3 4
)__4 5
;__5 6
ifaa 
(aa 
apiResponseaa 
.aa  
statusaa  &
==aa' )
ConstantHelperaa* 8
.aa8 9
APIStateaa9 A
.aaA B
SUCCESSaaB I
.aaI J
ToStringaaJ R
(aaR S
)aaS T
)aaT U
{bb 
ifcc 
(cc 
apiResponsecc #
.cc# $
apiStatusCodecc$ 1
==cc2 4
APIStatusCodecc5 B
.ccB C
UNAUTHORIZEDccC O
&&ccP R
!ccS T
	isApiCallccT ]
)cc] ^
{dd 
filterContextee %
.ee% &
Resultee& ,
=ee- .
newee/ 2!
RedirectToRouteResultee3 H
(eeH I
neweeI L 
RouteValueDictionaryeeM a
(eea b
neweeb e
{eef g

controllereeh r
=ees t
$streeu }
,ee} ~
action	ee Ö
=
eeÜ á
$str
eeà ê
}
eeë í
)
eeí ì
)
eeì î
;
eeî ï
}ff 
elsegg 
{hh 
ifii 
(ii 
!ii 
	isApiCallii &
)ii& '
{jj 
varkk 
lastLoginUserIdkk  /
=kk0 1
filterContextkk2 ?
.kk? @
HttpContextkk@ K
.kkK L
SessionkkL S
.kkS T
	GetStringkkT ]
(kk] ^
$strkk^ o
)kko p
;kkp q
ifll 
(ll  
!ll  !
stringll! '
.ll' (
IsNullOrEmptyll( 5
(ll5 6
lastLoginUserIdll6 E
)llE F
&&llG I
lastLoginUserIdllJ Y
!=llZ \
userIdll] c
)llc d
{mm 
filterContextnn  -
.nn- .
HttpContextnn. 9
.nn9 :
Sessionnn: A
.nnA B
SetInt32nnB J
(nnJ K
$strnnK ]
,nn] ^
$numnn_ `
)nn` a
;nna b
}oo 
filterContextpp )
.pp) *
HttpContextpp* 5
.pp5 6
Sessionpp6 =
.pp= >
	SetStringpp> G
(ppG H
$strppH Y
,ppY Z
userIdpp[ a
)ppa b
;ppb c
}qq 
CustomClaimss #
(ss# $
$strss$ 7
,ss7 8
filterContextss9 F
.ssF G
	RouteDatassG P
)ssP Q
;ssQ R
awaittt 
nexttt "
(tt" #
)tt# $
;tt$ %
}uu 
}vv 
elseww 
{xx 
ifyy 
(yy 
	isApiCallyy !
)yy! "
{zz 
if|| 
(|| 
apiResponse|| '
.||' (
data||( ,
!=||- /
null||0 4
&&||5 7
apiResponse||8 C
.||C D
data||D H
.||H I
ToString||I Q
(||Q R
)||R S
==||T V
$str||W h
)||h i
{}} 
CustomClaim~~ '
(~~' (
$str~~( ;
,~~; <
filterContext~~= J
.~~J K
	RouteData~~K T
)~~T U
;~~U V
await !
next" &
(& '
)' (
;( )
}
ÄÄ 
else
ÅÅ 
{
ÇÇ 
var
ÉÉ #
dynamicMessageService
ÉÉ  5
=
ÉÉ6 7
(
ÉÉ8 9$
IDynamicMessageService
ÉÉ9 O
)
ÉÉO P
filterContext
ÉÉP ]
.
ÉÉ] ^
HttpContext
ÉÉ^ i
.
ÉÉi j
RequestServices
ÉÉj y
.
ÉÉy z

GetServiceÉÉz Ñ
(ÉÉÑ Ö
typeofÉÉÖ ã
(ÉÉã å&
IDynamicMessageServiceÉÉå ¢
)ÉÉ¢ £
)ÉÉ£ §
;ÉÉ§ •
var
ÑÑ 
accessDeniedMSG
ÑÑ  /
=
ÑÑ0 1
await
ÑÑ2 7#
dynamicMessageService
ÑÑ8 M
.
ÑÑM N
Get
ÑÑN Q
(
ÑÑQ R!
POPUP_ACCESS_DENIED
ÑÑR e
)
ÑÑe f
;
ÑÑf g
ApiResponse
ÖÖ '
res
ÖÖ( +
=
ÖÖ, -
new
ÖÖ. 1
ApiResponse
ÖÖ2 =
(
ÖÖ= >
)
ÖÖ> ?
{
ÜÜ 
apiStatusCode
áá  -
=
áá. /
APIStatusCode
áá0 =
.
áá= >
ERROR
áá> C
,
ááC D
status
àà  &
=
àà' (
APIState
àà) 1
.
àà1 2
FAILED
àà2 8
.
àà8 9
GetDisplayValue
àà9 H
(
ààH I
)
ààI J
,
ààJ K
userMessage
ââ  +
=
ââ, -
new
ââ. 1
UserMessage
ââ2 =
{
ââ> ?
messageContent
ââ@ N
=
ââO P
new
ââQ T
MessageContent
ââU c
{
ââd e
messageType
ââf q
=
ââr s
accessDeniedMSGâât É
.ââÉ Ñ
messageTypeââÑ è
,ââè ê
messageCodeââë ú
=ââù û
accessDeniedMSGââü Æ
.ââÆ Ø
messageCodeââØ ∫
,ââ∫ ª
messageââº √
=ââƒ ≈
stringââ∆ Ã
.ââÃ Õ
FormatââÕ ”
(ââ” ‘
accessDeniedMSGââ‘ „
.ââ„ ‰
messageââ‰ Î
,ââÎ Ï
PROJECT_NAMEââÌ ˘
)ââ˘ ˙
}ââ˚ ¸
}ââ˝ ˛
}
ää 
;
ää 
filterContext
ãã )
.
ãã) *
Result
ãã* 0
=
ãã1 2
new
ãã3 6
OkObjectResult
ãã7 E
(
ããE F
res
ããF I
)
ããI J
;
ããJ K
}
åå 
}
çç 
else
éé 
{
èè 
if
ëë 
(
ëë 
apiResponse
ëë '
.
ëë' (
data
ëë( ,
!=
ëë- /
null
ëë0 4
&&
ëë5 7
apiResponse
ëë8 C
.
ëëC D
data
ëëD H
.
ëëH I
ToString
ëëI Q
(
ëëQ R
)
ëëR S
==
ëëT V
$str
ëëW h
)
ëëh i
{
íí 
filterContext
ìì )
.
ìì) *
Result
ìì* 0
=
ìì1 2
new
ìì3 6#
RedirectToRouteResult
ìì7 L
(
ììL M
new
ììM P"
RouteValueDictionary
ììQ e
(
ììe f
new
ììf i
{
ììj k

controller
ììl v
=
ììw x
$strììy Å
,ììÅ Ç
actionììÉ â
=ììä ã
$strììå î
}ììï ñ
)ììñ ó
)ììó ò
;ììò ô
}
îî 
else
ïï 
{
ññ 
filterContext
óó )
.
óó) *
Result
óó* 0
=
óó1 2
new
óó3 6#
RedirectToRouteResult
óó7 L
(
óóL M
new
óóM P"
RouteValueDictionary
óóQ e
(
óóe f
new
óóf i
{
óój k

controller
óól v
=
óów x
$stróóy Ñ
,óóÑ Ö
actionóóÜ å
=óóç é
$stróóè ù
}óóû ü
)óóü †
)óó† °
;óó° ¢
}
òò 
}
ôô 
}
öö 
}
õõ 
}
úú 	
public
ûû 
override
ûû 
void
ûû 
OnResultExecuted
ûû -
(
ûû- .#
ResultExecutedContext
ûû. C
filterContext
ûûD Q
)
ûûQ R
{
üü 	
CustomClaim
†† 
(
†† 
$str
†† *
,
††* +
filterContext
††, 9
.
††9 :
	RouteData
††: C
)
††C D
;
††D E
}
°° 	
public
££ 
override
££ 
void
££ 
OnResultExecuting
££ .
(
££. /$
ResultExecutingContext
££/ E
filterContext
££F S
)
££S T
{
§§ 	
CustomClaim
•• 
(
•• 
$str
•• ,
,
••, -
filterContext
••. ;
.
••; <
	RouteData
••< E
)
••E F
;
••F G
}
¶¶ 	
private
®® 
void
®® 
CustomClaim
®®  
(
®®  !
string
®®! '

methodName
®®( 2
,
®®2 3
	RouteData
®®4 =
	routeData
®®> G
)
®®G H
{
©© 	
var
™™ 
controllerName
™™ 
=
™™  
	routeData
™™! *
.
™™* +
Values
™™+ 1
[
™™1 2
$str
™™2 >
]
™™> ?
;
™™? @
var
´´ 

actionName
´´ 
=
´´ 
	routeData
´´ &
.
´´& '
Values
´´' -
[
´´- .
$str
´´. 6
]
´´6 7
;
´´7 8
var
¨¨ 
message
¨¨ 
=
¨¨ 
String
¨¨  
.
¨¨  !
Format
¨¨! '
(
¨¨' (
$str
¨¨( H
,
¨¨H I

methodName
¨¨J T
,
¨¨T U
controllerName
≠≠H V
,
≠≠V W

actionName
ÆÆH R
)
ÆÆR S
;
ÆÆS T
}
ØØ 	
}
∞∞ 
}±± ≈
KD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Controllers\LogOutController.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Controllers &
{ 
[ 
AllowAnonymous 
] 
public 

class 
LogOutController !
:" #

Controller$ .
{ 
private 
readonly  
IdentityserverConfig -!
_identityserverConfig. C
;C D
public 
LogOutController 
(  
IOptions  (
<( ) 
IdentityserverConfig) =
>= > 
identityserverConfig? S
)S T
{ 	!
_identityserverConfig !
=" # 
identityserverConfig$ 8
.8 9
Value9 >
;> ?
} 	
public 
IActionResult 
LogOut #
(# $
)$ %
{ 	
return 
new 
SignOutResult $
($ %
new% (
[( )
]) *
{+ ,!
_identityserverConfig- B
.B C 
AuthenticationSchemeC W
,W X
ConstantHelperY g
.g h4
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME	h è
}
ê ë
)
ë í
;
í ì
} 	
public 
IActionResult 
SignoutCleanup +
(+ ,
string, 2
sid3 6
)6 7
{ 	
var 
claims 
= 
User 
as  
ClaimsPrincipal! 0
;0 1
var   
sidClaim   
=   
claims   !
.  ! "
	FindFirst  " +
(  + ,
$str  , 1
)  1 2
;  2 3
if!! 
(!! 
sidClaim!! 
!=!! 
null!!  
&&!!! #
sidClaim!!$ ,
.!!, -
Value!!- 2
==!!3 5
sid!!6 9
)!!9 :
{"" 
HttpContext## 
.## 
SignOutAsync## (
(##( )!
_identityserverConfig##) >
.##> ? 
AuthenticationScheme##? S
)##S T
;##T U
foreach%% 
(%% 
var%% 
cookie%% #
in%%$ &
Request%%' .
.%%. /
Cookies%%/ 6
.%%6 7
Keys%%7 ;
)%%; <
{&& 
Response'' 
.'' 
Cookies'' $
.''$ %
Delete''% +
(''+ ,
cookie'', 2
)''2 3
;''3 4
}(( 
})) 
HttpContext** 
.** 
Session** 
.**  
Remove**  &
(**& '
$str**' 9
)**9 :
;**: ;
return,, 
Content,, 
(,, 
string,, !
.,,! "
Empty,," '
),,' (
;,,( )
}-- 	
}.. 
}// Ä?
LD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Controllers\UtilityController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
{ 
public 

class 
UtilityController "
:# $

Controller% /
{ 
private 
readonly 
ILogger  
<  !
UtilityController! 2
>2 3
_logger4 ;
;; <
	protected 
ConstantPath 
_constantPath ,
;, -
	protected  
IdentityserverConfig &!
_identityserverConfig' <
;< =
public 
UtilityController  
(  !
IOptions! )
<) *
ConstantPath* 6
>6 7
constantPath8 D
,D E
IOptionsF N
<N O 
IdentityserverConfigO c
>c d 
identityserverConfige y
,y z
ILogger	{ Ç
<
Ç É
UtilityController
É î
>
î ï
logger
ñ ú
)
ú ù
{ 	
_constantPath 
= 
constantPath (
.( )
Value) .
;. /!
_identityserverConfig !
=" # 
identityserverConfig$ 8
.8 9
Value9 >
;> ?
_logger 
= 
logger 
; 
} 	
public 
async 
Task 
< 
double  
>  !

RenewToken" ,
(, -
)- .
{   	
try!! 
{"" 
var## 
authInfo## 
=## 
await## $
HttpContext##% 0
.##0 1
AuthenticateAsync##1 B
(##B C!
_identityserverConfig##C X
.##X Y 
AuthenticationScheme##Y m
)##m n
;##n o
if$$ 
($$ 
authInfo$$ 
==$$ 
null$$  $
)$$$ %
{$$& '
return$$( .
$num$$/ 0
;$$0 1
}$$2 3
var&& 
refreshToken&&  
=&&! "
authInfo&&# +
.&&+ ,

Properties&&, 6
.&&6 7
GetTokenValue&&7 D
(&&D E
$str&&E T
)&&T U
;&&U V
var'' 
accessToken'' 
=''  !
authInfo''" *
.''* +

Properties''+ 5
.''5 6
GetTokenValue''6 C
(''C D
$str''D R
)''R S
;''S T
if(( 
((( 
refreshToken((  
==((! #
null(($ (
||(() +
accessToken((, 7
==((8 :
null((; ?
)((? @
{((A B
return((C I
$num((J K
;((K L
}((M N
var)) 
decodedAccessToken)) &
=))' (
new))) ,#
JwtSecurityTokenHandler))- D
())D E
)))E F
.))F G
ReadJwtToken))G S
())S T
accessToken))T _
)))_ `
;))` a
var++ 
now++ 
=++ 
DateTime++ "
.++" #
UtcNow++# )
;++) *
var,, 
timeElapsed,, 
=,,  !
now,," %
.,,% &
Subtract,,& .
(,,. /
decodedAccessToken,,/ A
.,,A B
Payload,,B I
.,,I J
	ValidFrom,,J S
),,S T
;,,T U
var-- 
timeRemaining-- !
=--" #
decodedAccessToken--$ 6
.--6 7
Payload--7 >
.--> ?
ValidTo--? F
.--F G
Subtract--G O
(--O P
now--P S
)--S T
;--T U
var.. 
tokenLifeTime.. !
=.." #
decodedAccessToken..$ 6
...6 7
Payload..7 >
...> ?
ValidTo..? F
...F G
Subtract..G O
(..O P
decodedAccessToken..P b
...b c
Payload..c j
...j k
	ValidFrom..k t
)..t u
...u v
TotalMilliseconds	..v á
;
..á à
var// 
setIntervalTime// #
=//$ %
Math//& *
.//* +
Floor//+ 0
(//0 1
tokenLifeTime//1 >
///? @
$num//A B
)//B C
;//C D
if11 
(11 
timeElapsed11 
>11  !
timeRemaining11" /
)11/ 0
{22 
HttpClientHandler33 %
handler33& -
=33. /
new330 3
HttpClientHandler334 E
{44 5
)ServerCertificateCustomValidationCallback55 A
=55B C
(55D E
httpRequestMessage55E W
,55W X
cert55Y ]
,55] ^
cetChain55_ g
,55g h
policyErrors55i u
)55u v
=>55w y
{55z {
return	55| Ç
true
55É á
;
55á à
}
55â ä
}66 
;66 

HttpClient77 
client77 %
=77& '
Startup77( /
.77/ 0
islocalhost770 ;
?77< =
new77> A

HttpClient77B L
(77L M
handler77M T
)77T U
:77V W
new77X [

HttpClient77\ f
(77f g
)77g h
;77h i
var99 
response99  
=99! "
await99# (
client99) /
.99/ 0$
RequestRefreshTokenAsync990 H
(99H I
new99I L
RefreshTokenRequest99M `
{:: 
Address;; 
=;;  !
_constantPath;;" /
.;;/ 0
IdentityserverURL;;0 A
+;;B C
ConstantHelper;;D R
.;;R S

TOKEN_PATH;;S ]
,;;] ^
ClientId<<  
=<<! "!
_identityserverConfig<<# 8
.<<8 9
ClientId<<9 A
,<<A B
ClientSecret== $
===% &!
_identityserverConfig==' <
.==< =
ClientSecret=== I
,==I J
RefreshToken>> $
=>>% &
refreshToken>>' 3
}?? 
)?? 
;?? 
ifAA 
(AA 
!AA 
responseAA !
.AA! "
IsErrorAA" )
)AA) *
{BB 
authInfoCC  
.CC  !

PropertiesCC! +
.CC+ ,
UpdateTokenValueCC, <
(CC< =
$strCC= K
,CCK L
responseCCM U
.CCU V
AccessTokenCCV a
)CCa b
;CCb c
authInfoDD  
.DD  !

PropertiesDD! +
.DD+ ,
UpdateTokenValueDD, <
(DD< =
$strDD= L
,DDL M
responseDDN V
.DDV W
RefreshTokenDDW c
)DDc d
;DDd e
authInfoEE  
.EE  !

PropertiesEE! +
.EE+ ,
UpdateTokenValueEE, <
(EE< =
$strEE= G
,EEG H
responseEEI Q
.EEQ R
IdentityTokenEER _
)EE_ `
;EE` a
}FF 
elseGG 
{HH 
_loggerII 
.II  
LogErrorII  (
(II( )
$strII) F
+IIG H
responseIII Q
.IIQ R
ErrorIIR W
+IIX Y
$strIIZ ^
+II_ `
responseIIa i
.IIi j
ErrorDescriptionIIj z
)IIz {
;II{ |
}JJ 
returnKK 
responseKK #
.KK# $
IsErrorKK$ +
?KK, -
$numKK. /
:KK0 1
setIntervalTimeKK2 A
;KKA B
}LL 
returnMM 
setIntervalTimeMM &
;MM& '
}NN 
catchOO 
(OO 
	ExceptionOO 
eOO 
)OO 
{PP 
_loggerQQ 
.QQ 
LogErrorQQ  
(QQ  !
eQQ! "
.QQ" #
ToStringQQ# +
(QQ+ ,
)QQ, -
)QQ- .
;QQ. /
returnRR 
$numRR 
;RR 
}SS 
}TT 	
}UU 
}VV ¥¶
KD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Controllers\ViewerController.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Controllers &
{ 
[ 
CustomAuthorization 
] 
public 

class 
ViewerController !
:" #

Controller$ .
{ 
private   
readonly   
FJTSqlDBContext   (
_FJTSqlDBContext  ) 9
;  9 :
private!! 
readonly!! $
IHttpsResponseRepository!! 1%
_iHttpsResponseRepository!!2 K
;!!K L
private"" 
readonly"" 
ConstantPath"" %
_constantPath""& 3
;""3 4
private## 
readonly## 
ConnectionStrings## *
_connectionStrings##+ =
;##= >
private$$ 
readonly$$ 
ILogger$$  
<$$  !
ViewerController$$! 1
>$$1 2
_logger$$3 :
;$$: ;
private%% 
readonly%% "
IDynamicMessageService%% /"
_dynamicMessageService%%0 F
;%%F G
static'' 
ViewerController'' 
(''  
)''  !
{(( 	

Stimulsoft** 
.** 
Base** 
.** 

StiLicense** &
.**& '
LoadFromFile**' 3
(**3 4
$str**4 A
)**A B
;**B C
}++ 	
public,, 
ViewerController,, 
(,,  
FJTSqlDBContext,,  /
context,,0 7
,,,7 8$
IHttpsResponseRepository,,9 Q$
iHttpsResponseRepository,,R j
,,,j k
IOptions,,l t
<,,t u
ConstantPath	,,u Å
>
,,Å Ç
constantPath
,,É è
,
,,è ê
IOptions
,,ë ô
<
,,ô ö
ConnectionStrings
,,ö ´
>
,,´ ¨
connectionStrings
,,≠ æ
,
,,æ ø
ILogger
,,¿ «
<
,,« »
ViewerController
,,» ÿ
>
,,ÿ Ÿ
logger
,,⁄ ‡
,
,,‡ ·$
IDynamicMessageService
,,‚ ¯#
dynamicMessageService
,,˘ é
)
,,é è
{-- 	
_FJTSqlDBContext.. 
=.. 
context.. &
;..& '%
_iHttpsResponseRepository// %
=//& '$
iHttpsResponseRepository//( @
;//@ A
_constantPath00 
=00 
constantPath00 (
.00( )
Value00) .
;00. /
_connectionStrings11 
=11  
connectionStrings11! 2
.112 3
Value113 8
;118 9
_logger22 
=22 
logger22 
;22 "
_dynamicMessageService33 "
=33# $!
dynamicMessageService33% :
;33: ;
}44 	
[:: 	
	Authorize::	 
]:: 
public;; 
async;; 
Task;; 
<;; 
IActionResult;; '
>;;' (
Index;;) .
(;;. /
string;;/ 5
id;;6 8
);;8 9
{<< 	
if== 
(== 
id== 
==== 
null== 
)== 
{>> 
return?? 
View?? 
(?? 
$str?? %
)??% &
;??& '
}@@ 
tryBB 
{CC 
varDD 
parameterGUIDDD !
=DD" #
GuidDD$ (
.DD( )
ParseDD) .
(DD. /
idDD/ 1
)DD1 2
;DD2 3
varEE 
reportIdEE 
=EE 
awaitEE $
_FJTSqlDBContextEE% 5
.EE5 6!
reportviewerparameterEE6 K
.EEK L
WhereEEL Q
(EEQ R
xEER S
=>EET V
xEEW X
.EEX Y
parameterGUIDEEY f
==EEg i
parameterGUIDEEj w
&&EEx z
xEE{ |
.EE| }
	isDeleted	EE} Ü
==
EEá â
false
EEä è
)
EEè ê
.
EEê ë
Select
EEë ó
(
EEó ò
x
EEò ô
=>
EEö ú
x
EEù û
.
EEû ü
reportId
EEü ß
)
EEß ®
.
EE® ©!
FirstOrDefaultAsync
EE© º
(
EEº Ω
)
EEΩ æ
;
EEæ ø
varHH 
reportmasterHH  
=HH! "
awaitHH# (
_FJTSqlDBContextHH) 9
.HH9 :
reportmasterHH: F
.HHF G
WhereHHG L
(HHL M
xHHM N
=>HHO Q
xHHR S
.HHS T
idHHT V
==HHW Y
reportIdHHZ b
&&HHc e
xHHf g
.HHg h
	isDeletedHHh q
==HHr t
falseHHu z
)HHz {
.HH{ |
Select	HH| Ç
(
HHÇ É
x
HHÉ Ñ
=>
HHÖ á
new
HHà ã
{
HHå ç
x
HHé è
.
HHè ê

reportName
HHê ö
,
HHö õ
x
HHú ù
.
HHù û"
reportGenerationType
HHû ≤
,
HH≤ ≥
x
HH¥ µ
.
HHµ ∂
fileName
HH∂ æ
,
HHæ ø
x
HH¿ ¡
.
HH¡ ¬
status
HH¬ »
,
HH» …
x
HH  À
.
HHÀ Ã
isEndUserReport
HHÃ €
}
HH‹ ›
)
HH› ﬁ
.
HHﬁ ﬂ!
FirstOrDefaultAsync
HHﬂ Ú
(
HHÚ Û
)
HHÛ Ù
;
HHÙ ı
ifII 
(II 
reportmasterII  
==II! #
nullII$ (
)II( )
{JJ 
returnKK 
ViewKK 
(KK  
$strKK  '
,KK' (
newKK) ,
ErrorViewModelKK- ;
{KK< =

StatusCodeKK> H
=KKI J
(KKK L
intKKL O
)KKO P
APIStatusCodeKKP ]
.KK] ^
PAGE_NOT_FOUNDKK^ l
,KKl m
MessageKKn u
=KKv w
REPORT_DETAILS	KKx Ü
}
KKá à
)
KKà â
;
KKâ ä
}LL 
varMM 
reportApiURLMM  
=MM! "
_constantPathMM# 0
.MM0 1
ReportApiURLMM1 =
+MM> ?'
CHECK_STATUS_OF_REPORT_FILEMM@ [
;MM[ \
varNN 
accessTokenNN 
=NN  !
HttpContextNN" -
.NN- .
GetTokenAsyncNN. ;
(NN; <
$strNN< J
)NNJ K
;NNK L
HttpClientHandlerPP !
handlerPP" )
=PP* +
newPP, /
HttpClientHandlerPP0 A
{QQ 5
)ServerCertificateCustomValidationCallbackRR =
=RR> ?
(RR@ A
httpRequestMessageRRA S
,RRS T
certRRU Y
,RRY Z
cetChainRR[ c
,RRc d
policyErrorsRRe q
)RRq r
=>RRs u
{RRv w
returnRRx ~
true	RR É
;
RRÉ Ñ
}
RRÖ Ü
}SS 
;SS 

HttpClientUU 
clientUU !
=UU" #
StartupUU$ +
.UU+ ,
islocalhostUU, 7
?UU8 9
newUU: =

HttpClientUU> H
(UUH I
handlerUUI P
)UUP Q
:UUR S
newUUT W

HttpClientUUX b
(UUb c
)UUc d
;UUd e
clientVV 
.VV !
DefaultRequestHeadersVV ,
.VV, -
AuthorizationVV- :
=VV; <
newVV= @%
AuthenticationHeaderValueVVA Z
(VVZ [
$strVV[ c
,VVc d
accessTokenVVe p
.VVp q
ResultVVq w
)VVw x
;VVx y
varXX 
	urlstringXX 
=XX 
reportApiURLXX  ,
+XX- .
$strXX/ ;
+XX< =
reportmasterXX> J
.XXJ K
fileNameXXK S
+XXT U
$strXXV i
+XXj k
reportmasterXXl x
.XXx y
isEndUserReport	XXy à
+
XXâ ä
$str
XXã £
+
XX§ •
reportmaster
XX¶ ≤
.
XX≤ ≥"
reportGenerationType
XX≥ «
;
XX« »
varYY 
responseYY 
=YY 
awaitYY $
clientYY% +
.YY+ ,
GetAsyncYY, 4
(YY4 5
	urlstringYY5 >
)YY> ?
;YY? @
responseZZ 
.ZZ #
EnsureSuccessStatusCodeZZ 0
(ZZ0 1
)ZZ1 2
;ZZ2 3
var]] 
responseModelString]] '
=]]( )
await]]* /
response]]0 8
.]]8 9
Content]]9 @
.]]@ A
ReadAsStringAsync]]A R
(]]R S
)]]S T
;]]T U
if__ 
(__ 
string__ 
.__ 
IsNullOrEmpty__ (
(__( )
responseModelString__) <
)__< =
)__= >
{`` 
varaa 
somethingWrongMSGaa )
=aa* +
awaitaa, 1"
_dynamicMessageServiceaa2 H
.aaH I
GetaaI L
(aaL M
SOMTHING_WRONGaaM [
)aa[ \
;aa\ ]
returnbb 
Viewbb 
(bb  
$strbb  '
,bb' (
newbb) ,
ErrorViewModelbb- ;
{bb< =

StatusCodebb> H
=bbI J
(bbK L
intbbL O
)bbO P
APIStatusCodebbP ]
.bb] ^!
INTERNAL_SERVER_ERRORbb^ s
,bbs t
Messagebbu |
=bb} ~
somethingWrongMSG	bb ê
.
bbê ë
message
bbë ò
}
bbô ö
)
bbö õ
;
bbõ ú
}cc 
varee 
responseModelee !
=ee" #
(ee$ %
ResponseModelee% 2
)ee2 3
(ee3 4
(ee4 5

Newtonsoftee5 ?
.ee? @
Jsonee@ D
.eeD E
LinqeeE I
.eeI J
JObjecteeJ Q
)eeQ R

NewtonsofteeR \
.ee\ ]
Jsonee] a
.eea b
JsonConverteeb m
.eem n
DeserializeObjecteen 
(	ee Ä!
responseModelString
eeÄ ì
)
eeì î
)
eeî ï
.
eeï ñ
ToObjectff  
(ff  !
typeofff! '
(ff' (
ResponseModelff( 5
)ff5 6
)ff6 7
;ff7 8
ifgg 
(gg 
responseModelgg !
.gg! "
	IsSuccessgg" +
==gg, .
falsegg/ 4
||gg5 7
(gg8 9
boolgg9 =
)gg= >
responseModelgg> K
.ggK L
ModelggL Q
==ggR T
falseggU Z
)ggZ [
{hh 
varii 
somethingWrongMSGii )
=ii* +
awaitii, 1"
_dynamicMessageServiceii2 H
.iiH I
GetiiI L
(iiL M
SOMTHING_WRONGiiM [
)ii[ \
;ii\ ]
varjj 
notExistsMSGjj $
=jj% &
awaitjj' ,"
_dynamicMessageServicejj- C
.jjC D
GetjjD G
(jjG H
$strjjH T
)jjT U
;jjU V
returnkk 
Viewkk 
(kk  
$strkk  '
,kk' (
newkk) ,
ErrorViewModelkk- ;
{kk< =

StatusCodekk> H
=kkI J
responseModelkkK X
.kkX Y
	IsSuccesskkY b
?kkc d
(kke f
intkkf i
)kki j
APIStatusCodekkj w
.kkw x
PAGE_NOT_FOUND	kkx Ü
:
kká à
(
kkâ ä
int
kkä ç
)
kkç é
APIStatusCode
kké õ
.
kkõ ú#
INTERNAL_SERVER_ERROR
kkú ±
,
kk± ≤
Message
kk≥ ∫
=
kkª º
responseModel
kkΩ  
.
kk  À
	IsSuccess
kkÀ ‘
?
kk’ ÷
string
kk◊ ›
.
kk› ﬁ
Format
kkﬁ ‰
(
kk‰ Â
notExistsMSG
kkÂ Ò
.
kkÒ Ú
message
kkÚ ˘
,
kk˘ ˙
REPORT_ENTITY
kk˚ à
)
kkà â
:
kkä ã
somethingWrongMSG
kkå ù
.
kkù û
message
kkû •
}
kk¶ ß
)
kkß ®
;
kk® ©
}ll 
ViewBagoo 
.oo 

ReportNameoo "
=oo# $
reportmasteroo% 1
.oo1 2

reportNameoo2 <
;oo< =
ViewBagpp 
.pp 
urlParameterpp $
=pp% &
idpp' )
;pp) *
ViewBagqq 
.qq 
statusqq 
=qq  
reportmasterqq! -
.qq- .
statusqq. 4
==qq5 7
ReportStatusqq8 D
.qqD E
DraftqqE J
.qqJ K
GetDisplayValueqqK Z
(qqZ [
)qq[ \
?qq] ^
ReportStatusqq_ k
.qqk l
Draftqql q
.qqq r
ToStringqqr z
(qqz {
)qq{ |
:qq} ~
ReportStatus	qq ã
.
qqã å
	Published
qqå ï
.
qqï ñ
ToString
qqñ û
(
qqû ü
)
qqü †
;
qq† °
returnss 
Viewss 
(ss 
)ss 
;ss 
}tt 
catchuu 
(uu 
	Exceptionuu 
euu 
)uu 
{vv 
_loggerww 
.ww 
LogErrorww  
(ww  !
eww! "
.ww" #
ToStringww# +
(ww+ ,
)ww, -
)ww- .
;ww. /
returnxx 
Viewxx 
(xx 
$strxx #
,xx# $
newxx% (
ErrorViewModelxx) 7
{xx8 9

StatusCodexx: D
=xxE F
(xxG H
intxxH K
)xxK L
APIStatusCodexxL Y
.xxY Z!
INTERNAL_SERVER_ERRORxxZ o
,xxo p
Messagexxq x
=xxy z
exx{ |
.xx| }
Message	xx} Ñ
}
xxÖ Ü
)
xxÜ á
;
xxá à
}yy 
}zz 	
[
ÇÇ 	
	Authorize
ÇÇ	 
]
ÇÇ 
public
ÉÉ 
async
ÉÉ 
Task
ÉÉ 
<
ÉÉ 
IActionResult
ÉÉ '
>
ÉÉ' (
	GetReport
ÉÉ) 2
(
ÉÉ2 3
string
ÉÉ3 9
id
ÉÉ: <
)
ÉÉ< =
{
ÑÑ 	
try
ÖÖ 
{
ÜÜ 
var
áá 
parameterGuid
áá !
=
áá" #
Guid
áá$ (
.
áá( )
Parse
áá) .
(
áá. /
id
áá/ 1
)
áá1 2
;
áá2 3#
reportviewerparameter
àà %#
reportviewerparameter
àà& ;
=
àà< =
await
àà> C
_FJTSqlDBContext
ààD T
.
ààT U#
reportviewerparameter
ààU j
.
ààj k
Where
ààk p
(
ààp q
x
ààq r
=>
ààs u
x
ààv w
.
ààw x
parameterGUIDààx Ö
==ààÜ à
parameterGuidààâ ñ
&&ààó ô
xààö õ
.ààõ ú
	isDeletedààú •
==àà¶ ®
falseàà© Æ
)ààÆ Ø
.ààØ ∞#
FirstOrDefaultAsyncàà∞ √
(àà√ ƒ
)ààƒ ≈
;àà≈ ∆
reportmaster
ââ 
reportmaster
ââ )
=
ââ* +
await
ââ, 1
_FJTSqlDBContext
ââ2 B
.
ââB C
reportmaster
ââC O
.
ââO P
Where
ââP U
(
ââU V
x
ââV W
=>
ââX Z
x
ââ[ \
.
ââ\ ]
id
ââ] _
==
ââ` b#
reportviewerparameter
ââc x
.
ââx y
reportIdâây Å
&&ââÇ Ñ
xââÖ Ü
.ââÜ á
	isDeletedââá ê
==ââë ì
falseââî ô
)ââô ö
.ââö õ#
FirstOrDefaultAsyncââõ Æ
(ââÆ Ø
)ââØ ∞
;ââ∞ ±
var
ãã 
reportApiURL
ãã  
=
ãã! "
_constantPath
ãã# 0
.
ãã0 1
ReportApiURL
ãã1 =
+
ãã> ?"
GET_REPORT_BYTE_DATA
ãã@ T
;
ããT U
var
åå 
accessToken
åå 
=
åå  !
HttpContext
åå" -
.
åå- .
GetTokenAsync
åå. ;
(
åå; <
$str
åå< J
)
ååJ K
;
ååK L
HttpClientHandler
éé !
handler
éé" )
=
éé* +
new
éé, /
HttpClientHandler
éé0 A
{
èè 7
)ServerCertificateCustomValidationCallback
êê =
=
êê> ?
(
êê@ A 
httpRequestMessage
êêA S
,
êêS T
cert
êêU Y
,
êêY Z
cetChain
êê[ c
,
êêc d
policyErrors
êêe q
)
êêq r
=>
êês u
{
êêv w
return
êêx ~
trueêê É
;êêÉ Ñ
}êêÖ Ü
}
ëë 
;
ëë 

HttpClient
ìì 
client
ìì !
=
ìì" #
Startup
ìì$ +
.
ìì+ ,
islocalhost
ìì, 7
?
ìì8 9
new
ìì: =

HttpClient
ìì> H
(
ììH I
handler
ììI P
)
ììP Q
:
ììR S
new
ììT W

HttpClient
ììX b
(
ììb c
)
ììc d
;
ììd e
client
îî 
.
îî #
DefaultRequestHeaders
îî ,
.
îî, -
Authorization
îî- :
=
îî; <
new
îî= @'
AuthenticationHeaderValue
îîA Z
(
îîZ [
$str
îî[ c
,
îîc d
accessToken
îîe p
.
îîp q
Result
îîq w
)
îîw x
;
îîx y
var
ññ 
	urlstring
ññ 
=
ññ 
reportApiURL
ññ  ,
+
ññ- .
$str
ññ/ ;
+
ññ< =
reportmaster
ññ> J
.
ññJ K
fileName
ññK S
+
ññT U
$str
ññV i
+
ññj k
reportmaster
ññl x
.
ññx y
isEndUserReportññy à
+ññâ ä
$strññã £
+ññ§ •
reportmasterññ¶ ≤
.ññ≤ ≥$
reportGenerationTypeññ≥ «
;ññ« »
var
óó 
response
óó 
=
óó 
await
óó $
client
óó% +
.
óó+ ,
GetAsync
óó, 4
(
óó4 5
	urlstring
óó5 >
)
óó> ?
;
óó? @
response
òò 
.
òò %
EnsureSuccessStatusCode
òò 0
(
òò0 1
)
òò1 2
;
òò2 3
var
õõ !
responseModelString
õõ '
=
õõ( )
await
õõ* /
response
õõ0 8
.
õõ8 9
Content
õõ9 @
.
õõ@ A
ReadAsStringAsync
õõA R
(
õõR S
)
õõS T
;
õõT U
var
ùù 
responseModel
ùù !
=
ùù" #
(
ùù$ %
ResponseModel
ùù% 2
)
ùù2 3
(
ùù3 4
(
ùù4 5

Newtonsoft
ùù5 ?
.
ùù? @
Json
ùù@ D
.
ùùD E
Linq
ùùE I
.
ùùI J
JObject
ùùJ Q
)
ùùQ R

Newtonsoft
ùùR \
.
ùù\ ]
Json
ùù] a
.
ùùa b
JsonConvert
ùùb m
.
ùùm n
DeserializeObject
ùùn 
(ùù Ä#
responseModelStringùùÄ ì
)ùùì î
)ùùî ï
.ùùï ñ
ToObject
ûû  
(
ûû  !
typeof
ûû! '
(
ûû' (
ResponseModel
ûû( 5
)
ûû5 6
)
ûû6 7
;
ûû7 8
ReportByteDataVM
üü  
reportByteDataVM
üü! 1
=
üü2 3
(
üü4 5
ReportByteDataVM
üü5 E
)
üüE F
(
üüF G
(
üüG H

Newtonsoft
üüH R
.
üüR S
Json
üüS W
.
üüW X
Linq
üüX \
.
üü\ ]
JObject
üü] d
)
üüd e

Newtonsoft
üüe o
.
üüo p
Json
üüp t
.
üüt u
JsonConvertüüu Ä
.üüÄ Å!
DeserializeObjectüüÅ í
(üüí ì
responseModelüüì †
.üü† °
Modelüü° ¶
.üü¶ ß
ToStringüüß Ø
(üüØ ∞
)üü∞ ±
)üü± ≤
)üü≤ ≥
.üü≥ ¥
ToObject
††  
(
††  !
typeof
††! '
(
††' (
ReportByteDataVM
††( 8
)
††8 9
)
††9 :
;
††: ;
var
°° 
reportByteData
°° "
=
°°# $
reportByteDataVM
°°% 5
.
°°5 6
ReportByteData
°°6 D
;
°°D E
var
¢¢ 
companyInfo
¢¢ 
=
¢¢  !
await
¢¢" '
_FJTSqlDBContext
¢¢( 8
.
¢¢8 9
CompanyInfos
¢¢9 E
.
¢¢E F
Include
¢¢F M
(
¢¢M N
x
¢¢N O
=>
¢¢P R
x
¢¢S T
.
¢¢T U

Mfgcodemst
¢¢U _
)
¢¢_ `
.
¢¢` a
Select
¢¢a g
(
¢¢g h
x
¢¢h i
=>
¢¢j l
new
¢¢m p
{
¢¢q r
x
¢¢s t
.
¢¢t u

Mfgcodemst
¢¢u 
.¢¢ Ä
mfgCode¢¢Ä á
}¢¢à â
)¢¢â ä
.¢¢ä ã#
FirstOrDefaultAsync¢¢ã û
(¢¢û ü
)¢¢ü †
;¢¢† °
var
•• 
report
•• 
=
•• 
new
••  
	StiReport
••! *
(
••* +
)
••+ ,
;
••, -
report
¶¶ 
.
¶¶ 
Load
¶¶ 
(
¶¶ 
reportByteData
¶¶ *
)
¶¶* +
;
¶¶+ ,
report
ßß 
.
ßß 

ReportName
ßß !
=
ßß" ##
reportviewerparameter
ßß$ 9
.
ßß9 :

reportName
ßß: D
!=
ßßE G
null
ßßH L
?
ßßM N
companyInfo
ßßO Z
.
ßßZ [
mfgCode
ßß[ b
+
ßßc d#
reportviewerparameter
ßße z
.
ßßz {

reportNameßß{ Ö
:ßßÜ á
reportmasterßßà î
.ßßî ï

reportNameßßï ü
;ßßü †
StiDictionary
®® 

dictionary
®® (
=
®®) *
report
®®+ 1
.
®®1 2

Dictionary
®®2 <
;
®®< =
var
´´ 
dbList
´´ 
=
´´ 

dictionary
´´ '
.
´´' (
	Databases
´´( 1
.
´´1 2
ToList
´´2 8
(
´´8 9
)
´´9 :
;
´´: ;
for
¨¨ 
(
¨¨ 
int
¨¨ 
i
¨¨ 
=
¨¨ 
$num
¨¨ 
;
¨¨ 
i
¨¨  !
<
¨¨" #
dbList
¨¨$ *
.
¨¨* +
Count
¨¨+ 0
;
¨¨0 1
i
¨¨2 3
++
¨¨3 5
)
¨¨5 6
{
≠≠ 
(
ÆÆ 
(
ÆÆ 
StiSqlDatabase
ÆÆ $
)
ÆÆ$ %

dictionary
ÆÆ% /
.
ÆÆ/ 0
	Databases
ÆÆ0 9
[
ÆÆ9 :
i
ÆÆ: ;
]
ÆÆ; <
)
ÆÆ< =
.
ÆÆ= >
ConnectionString
ÆÆ> N
=
ÆÆO P 
_connectionStrings
ÆÆQ c
.
ÆÆc d
ReportConnection
ÆÆd t
;
ÆÆt u
}
ØØ 
var
≤≤ 
variableList
≤≤  
=
≤≤! "

dictionary
≤≤# -
.
≤≤- .
	Variables
≤≤. 7
.
≤≤7 8
ToList
≤≤8 >
(
≤≤> ?
)
≤≤? @
;
≤≤@ A
foreach
≥≥ 
(
≥≥ 
var
≥≥ 
item
≥≥ !
in
≥≥" $
variableList
≥≥% 1
)
≥≥1 2
{
¥¥ 
item
µµ 
.
µµ 
Value
µµ 
=
µµ  
null
µµ! %
;
µµ% &
}
∂∂ 
foreach
ππ 
(
ππ 
var
ππ 
variableName
ππ )
in
ππ* ,
Enum
ππ- 1
.
ππ1 2
GetNames
ππ2 :
(
ππ: ;
typeof
ππ; A
(
ππA B$
ConstantReportVariable
ππB X
)
ππX Y
)
ππY Z
)
ππZ [
{
∫∫ 
if
ªª 
(
ªª 
report
ªª 
.
ªª 
IsVariableExist
ªª .
(
ªª. /
variableName
ªª/ ;
)
ªª; <
)
ªª< =
{
ºº $
ConstantReportVariable
ΩΩ .
reportVariable
ΩΩ/ =
=
ΩΩ> ?
(
ΩΩ@ A$
ConstantReportVariable
ΩΩA W
)
ΩΩW X
Enum
ΩΩX \
.
ΩΩ\ ]
Parse
ΩΩ] b
(
ΩΩb c
typeof
ΩΩc i
(
ΩΩi j%
ConstantReportVariableΩΩj Ä
)ΩΩÄ Å
,ΩΩÅ Ç
variableNameΩΩÉ è
)ΩΩè ê
;ΩΩê ë

dictionary
ææ "
.
ææ" #
	Variables
ææ# ,
[
ææ, -
variableName
ææ- 9
]
ææ9 :
.
ææ: ;
Value
ææ; @
=
ææA B
reportVariable
ææC Q
.
ææQ R
GetDisplayValue
ææR a
(
ææa b
)
ææb c
;
ææc d
}
øø 
}
¿¿ 
FilterParameters
¬¬  
filterParameters
¬¬! 1
=
¬¬2 3
new
¬¬4 7
FilterParameters
¬¬8 H
(
¬¬H I
)
¬¬I J
;
¬¬J K
if
√√ 
(
√√ 
!
√√ 
String
√√ 
.
√√ 
IsNullOrEmpty
√√ )
(
√√) *#
reportviewerparameter
√√* ?
.
√√? @
parameterValues
√√@ O
)
√√O P
)
√√P Q
{
ƒƒ 
filterParameters
∆∆ $
=
∆∆% &
(
∆∆' (
FilterParameters
∆∆( 8
)
∆∆8 9
(
∆∆9 :
(
∆∆: ;

Newtonsoft
∆∆; E
.
∆∆E F
Json
∆∆F J
.
∆∆J K
Linq
∆∆K O
.
∆∆O P
JObject
∆∆P W
)
∆∆W X

Newtonsoft
∆∆X b
.
∆∆b c
Json
∆∆c g
.
∆∆g h
JsonConvert
∆∆h s
.
∆∆s t 
DeserializeObject∆∆t Ö
(∆∆Ö Ü%
reportviewerparameter∆∆Ü õ
.∆∆õ ú
parameterValues∆∆ú ´
)∆∆´ ¨
)∆∆¨ ≠
.∆∆≠ Æ
ToObject
««@ H
(
««H I
typeof
««I O
(
««O P
FilterParameters
««P `
)
««` a
)
««a b
;
««b c
}
»» 
PropertyInfo
ÀÀ 
[
ÀÀ 
]
ÀÀ (
filterParametersProperties
ÀÀ 9
=
ÀÀ: ;
filterParameters
ÀÀ< L
.
ÀÀL M
GetType
ÀÀM T
(
ÀÀT U
)
ÀÀU V
.
ÀÀV W
GetProperties
ÀÀW d
(
ÀÀd e
)
ÀÀe f
;
ÀÀf g
var
ŒŒ '
reportmasterparameterList
ŒŒ -
=
ŒŒ. /
await
ŒŒ0 5
_FJTSqlDBContext
ŒŒ6 F
.
ŒŒF G#
reportmasterparameter
ŒŒG \
.
ŒŒ\ ]
Where
ŒŒ] b
(
ŒŒb c
x
ŒŒc d
=>
ŒŒe g
x
ŒŒh i
.
ŒŒi j
reportId
ŒŒj r
==
ŒŒs u
reportmasterŒŒv Ç
.ŒŒÇ É
idŒŒÉ Ö
&&ŒŒÜ à
xŒŒâ ä
.ŒŒä ã
	isDeletedŒŒã î
==ŒŒï ó
falseŒŒò ù
)ŒŒù û
.ŒŒû ü
SelectŒŒü •
(ŒŒ• ¶
xŒŒ¶ ß
=>ŒŒ® ™
xŒŒ´ ¨
.ŒŒ¨ ≠!
parmeterMappingidŒŒ≠ æ
)ŒŒæ ø
.ŒŒø ¿
ToListAsyncŒŒ¿ À
(ŒŒÀ Ã
)ŒŒÃ Õ
;ŒŒÕ Œ
var
œœ  
param_DbColumnList
œœ &
=
œœ' (
await
œœ) .
_FJTSqlDBContext
œœ/ ?
.
œœ? @.
 report_parameter_setting_mapping
œœ@ `
.
œœ` a
Where
œœa f
(
œœf g
x
œœg h
=>
œœi k(
reportmasterparameterListœœl Ö
.œœÖ Ü
AnyœœÜ â
(œœâ ä
paramIdœœä ë
=>œœí î
xœœï ñ
.œœñ ó
idœœó ô
==œœö ú
paramIdœœù §
)œœ§ •
)œœ• ¶
.œœ¶ ß
Selectœœß ≠
(œœ≠ Æ
xœœÆ Ø
=>œœ∞ ≤
newœœ≥ ∂
{œœ∑ ∏
xœœπ ∫
.œœ∫ ª
reportParamNameœœª  
,œœ  À
xœœÃ Õ
.œœÕ Œ
dbColumnNameœœŒ ⁄
}œœ€ ‹
)œœ‹ ›
.œœ› ﬁ
ToListAsyncœœﬁ È
(œœÈ Í
)œœÍ Î
;œœÎ Ï
foreach
—— 
(
—— 
var
—— 
item
—— !
in
——" $ 
param_DbColumnList
——% 7
)
——7 8
{
““ 
var
”” 
valueObj
””  
=
””! "(
filterParametersProperties
””# =
.
””= >
Where
””> C
(
””C D
x
””D E
=>
””F H
x
””I J
.
””J K
Name
””K O
==
””P R
item
””S W
.
””W X
dbColumnName
””X d
)
””d e
.
””e f
Select
””f l
(
””l m
x
””m n
=>
””o q
x
””r s
.
””s t
GetValue
””t |
(
””| }
filterParameters””} ç
)””ç é
)””é è
.””è ê
FirstOrDefault””ê û
(””û ü
)””ü †
;””† °
var
‘‘ 

paramValue
‘‘ "
=
‘‘# $
string
‘‘% +
.
‘‘+ ,
Empty
‘‘, 1
;
‘‘1 2
if
’’ 
(
’’ 
valueObj
’’  
!=
’’! #
null
’’$ (
)
’’( )
{
÷÷ 

paramValue
◊◊ "
=
◊◊# $
valueObj
◊◊% -
.
◊◊- .
ToString
◊◊. 6
(
◊◊6 7
)
◊◊7 8
;
◊◊8 9
}
ÿÿ 
var
ŸŸ 
stiVariable
ŸŸ #
=
ŸŸ$ %

dictionary
ŸŸ& 0
.
ŸŸ0 1
	Variables
ŸŸ1 :
[
ŸŸ: ;
item
ŸŸ; ?
.
ŸŸ? @
reportParamName
ŸŸ@ O
]
ŸŸO P
;
ŸŸP Q
if
⁄⁄ 
(
⁄⁄ 
report
⁄⁄ 
.
⁄⁄ 
IsVariableExist
⁄⁄ .
(
⁄⁄. /
item
⁄⁄/ 3
.
⁄⁄3 4
reportParamName
⁄⁄4 C
)
⁄⁄C D
)
⁄⁄D E
{
€€ 

dictionary
‹‹ "
.
‹‹" #
	Variables
‹‹# ,
[
‹‹, -
item
‹‹- 1
.
‹‹1 2
reportParamName
‹‹2 A
]
‹‹A B
.
‹‹B C
Value
‹‹C H
=
‹‹I J

paramValue
‹‹K U
;
‹‹U V
}
›› 
else
ﬁﬁ 
{
ﬂﬂ 

dictionary
‡‡ "
.
‡‡" #
	Variables
‡‡# ,
.
‡‡, -
Add
‡‡- 0
(
‡‡0 1
$str
‡‡1 3
,
‡‡3 4
item
‡‡5 9
.
‡‡9 :
reportParamName
‡‡: I
,
‡‡I J
item
‡‡K O
.
‡‡O P
reportParamName
‡‡P _
,
‡‡_ `

paramValue
‡‡a k
)
‡‡k l
;
‡‡l m
}
·· 
}
‚‚ 
if
ÂÂ 
(
ÂÂ 
report
ÂÂ 
.
ÂÂ 
IsVariableExist
ÂÂ *
(
ÂÂ* +
PARA_REPORT_TITLE
ÂÂ+ <
)
ÂÂ< =
)
ÂÂ= >
{
ÊÊ 

dictionary
ÁÁ 
.
ÁÁ 
	Variables
ÁÁ (
[
ÁÁ( )
PARA_REPORT_TITLE
ÁÁ) :
]
ÁÁ: ;
.
ÁÁ; <
Value
ÁÁ< A
=
ÁÁB C
reportmaster
ÁÁD P
.
ÁÁP Q
reportTitle
ÁÁQ \
;
ÁÁ\ ]
}
ËË 
if
ÈÈ 
(
ÈÈ 
report
ÈÈ 
.
ÈÈ 
IsVariableExist
ÈÈ *
(
ÈÈ* +!
PARA_REPORT_VERSION
ÈÈ+ >
)
ÈÈ> ?
)
ÈÈ? @
{
ÍÍ 

dictionary
ÎÎ 
.
ÎÎ 
	Variables
ÎÎ (
[
ÎÎ( )!
PARA_REPORT_VERSION
ÎÎ) <
]
ÎÎ< =
.
ÎÎ= >
Value
ÎÎ> C
=
ÎÎD E
reportmaster
ÎÎF R
.
ÎÎR S
reportVersion
ÎÎS `
??
ÎÎa c
$str
ÎÎd g
;
ÎÎg h
}
ÏÏ 
if
ÌÌ 
(
ÌÌ 
report
ÌÌ 
.
ÌÌ 
IsVariableExist
ÌÌ *
(
ÌÌ* +'
Para_ROHS_ImageFolderPath
ÌÌ+ D
)
ÌÌD E
)
ÌÌE F
{
ÓÓ 

dictionary
ÔÔ 
.
ÔÔ 
	Variables
ÔÔ (
[
ÔÔ( )'
Para_ROHS_ImageFolderPath
ÔÔ) B
]
ÔÔB C
.
ÔÔC D
Value
ÔÔD I
=
ÔÔJ K
string
ÔÔL R
.
ÔÔR S
Concat
ÔÔS Y
(
ÔÔY Z
_constantPath
ÔÔZ g
.
ÔÔg h
APIURL
ÔÔh n
,
ÔÔn o
_constantPath
ÔÔp }
.
ÔÔ} ~
RoHSImagesPathÔÔ~ å
)ÔÔå ç
;ÔÔç é
}
 
await
ÚÚ 
report
ÚÚ 
.
ÚÚ 
RenderAsync
ÚÚ (
(
ÚÚ( )
)
ÚÚ) *
;
ÚÚ* +
return
ÛÛ 
StiNetCoreViewer
ÛÛ '
.
ÛÛ' (
GetReportResult
ÛÛ( 7
(
ÛÛ7 8
this
ÛÛ8 <
,
ÛÛ< =
report
ÛÛ> D
)
ÛÛD E
;
ÛÛE F
}
ÙÙ 
catch
ıı 
(
ıı 
	Exception
ıı 
e
ıı 
)
ıı 
{
ˆˆ 
_logger
˜˜ 
.
˜˜ 
LogError
˜˜  
(
˜˜  !
e
˜˜! "
.
˜˜" #
ToString
˜˜# +
(
˜˜+ ,
)
˜˜, -
)
˜˜- .
;
˜˜. /
var
¯¯ 
report
¯¯ 
=
¯¯ 
new
¯¯  
	StiReport
¯¯! *
(
¯¯* +
)
¯¯+ ,
;
¯¯, -
report
˘˘ 
.
˘˘ 
Load
˘˘ 
(
˘˘ 
StiNetCoreHelper
˘˘ ,
.
˘˘, -
MapPath
˘˘- 4
(
˘˘4 5
this
˘˘5 9
,
˘˘9 :
$str
˘˘; T
)
˘˘T U
)
˘˘U V
;
˘˘V W
report
˙˙ 
.
˙˙ 

Dictionary
˙˙ !
.
˙˙! "
	Variables
˙˙" +
[
˙˙+ ,
$str
˙˙, 8
]
˙˙8 9
.
˙˙9 :
Value
˙˙: ?
=
˙˙@ A
e
˙˙B C
.
˙˙C D
Message
˙˙D K
;
˙˙K L
report
˚˚ 
.
˚˚ 

ReportName
˚˚ !
=
˚˚" #
$str
˚˚$ +
;
˚˚+ ,
return
¸¸ 
StiNetCoreViewer
¸¸ '
.
¸¸' (
GetReportResult
¸¸( 7
(
¸¸7 8
this
¸¸8 <
,
¸¸< =
report
¸¸> D
)
¸¸D E
;
¸¸E F
}
˝˝ 
}
˛˛ 	
[
ÑÑ 	
	Authorize
ÑÑ	 
]
ÑÑ 
public
ÖÖ 
async
ÖÖ 
Task
ÖÖ 
<
ÖÖ 
IActionResult
ÖÖ '
>
ÖÖ' (
ViewerEvent
ÖÖ) 4
(
ÖÖ4 5
)
ÖÖ5 6
{
ÜÜ 	
return
áá 
await
áá 
StiNetCoreViewer
áá )
.
áá) *$
ViewerEventResultAsync
áá* @
(
áá@ A
this
ááA E
)
ááE F
;
ááF G
}
àà 	
[
èè 	
Route
èè	 
(
èè 
$str
èè *
)
èè* +
]
èè+ ,
[
êê 	
	Authorize
êê	 
(
êê #
AuthenticationSchemes
êê (
=
êê) *
JwtBearerDefaults
êê+ <
.
êê< ="
AuthenticationScheme
êê= Q
)
êêQ R
]
êêR S
[
ëë 	
HttpPost
ëë	 
]
ëë 
public
íí 
async
íí 
Task
íí 
<
íí 
IActionResult
íí '
>
íí' (
DownloadReport
íí) 7
(
íí7 8
[
íí8 9
FromBody
íí9 A
]
ííA B
DownlodReportVM
ííC R
downlodReportVM
ííS b
)
ííb c
{
ìì 	
if
îî 
(
îî 
downlodReportVM
îî 
==
îî  "
null
îî# '
)
îî' (
{
ïï 
var
ññ !
invalidParameterMSG
ññ '
=
ññ( )
await
ññ* /$
_dynamicMessageService
ññ0 F
.
ññF G
Get
ññG J
(
ññJ K
INVALID_PARAMETER
ññK \
)
ññ\ ]
;
ññ] ^
ApiResponse
óó 
badRequestRes
óó )
=
óó* +
new
óó, /
ApiResponse
óó0 ;
(
óó; <
)
óó< =
{
òò 
userMessage
ôô 
=
ôô  !
new
ôô" %
UserMessage
ôô& 1
(
ôô1 2
)
ôô2 3
{
ôô4 5
messageContent
ôô6 D
=
ôôE F
new
ôôG J
MessageContent
ôôK Y
{
ôôZ [
messageType
ôô\ g
=
ôôh i!
invalidParameterMSG
ôôj }
.
ôô} ~
messageTypeôô~ â
,ôôâ ä
messageCodeôôã ñ
=ôôó ò#
invalidParameterMSGôôô ¨
.ôô¨ ≠
messageCodeôô≠ ∏
,ôô∏ π
messageôô∫ ¡
=ôô¬ √#
invalidParameterMSGôôƒ ◊
.ôô◊ ÿ
messageôôÿ ﬂ
}ôô‡ ·
}ôô‚ „
}
öö 
;
öö 
return
õõ 

BadRequest
õõ !
(
õõ! "
badRequestRes
õõ" /
)
õõ/ 0
;
õõ0 1
}
úú 
try
ùù 
{
ûû 
var
üü 
parameterGuid
üü !
=
üü" #
Guid
üü$ (
.
üü( )
Parse
üü) .
(
üü. /
downlodReportVM
üü/ >
.
üü> ?
ParameterGuid
üü? L
)
üüL M
;
üüM N#
reportviewerparameter
†† %#
reportviewerparameter
††& ;
=
††< =
await
††> C
_FJTSqlDBContext
††D T
.
††T U#
reportviewerparameter
††U j
.
††j k!
FirstOrDefaultAsync
††k ~
(
††~ 
x†† Ä
=>††Å É
x††Ñ Ö
.††Ö Ü
parameterGUID††Ü ì
==††î ñ
parameterGuid††ó §
&&††• ß
x††® ©
.††© ™
	isDeleted††™ ≥
==††¥ ∂
false††∑ º
)††º Ω
;††Ω æ
reportmaster
°° 
reportmaster
°° )
=
°°* +
await
°°, 1
_FJTSqlDBContext
°°2 B
.
°°B C
reportmaster
°°C O
.
°°O P!
FirstOrDefaultAsync
°°P c
(
°°c d
x
°°d e
=>
°°f h
x
°°i j
.
°°j k
id
°°k m
==
°°n p$
reportviewerparameter°°q Ü
.°°Ü á
reportId°°á è
&&°°ê í
x°°ì î
.°°î ï
	isDeleted°°ï û
==°°ü °
false°°¢ ß
)°°ß ®
;°°® ©
if
¢¢ 
(
¢¢ 
reportmaster
¢¢  
==
¢¢! #
null
¢¢$ (
)
¢¢( )
{
££ 
var
§§ 
notFoundMSG
§§ #
=
§§$ %
await
§§& +$
_dynamicMessageService
§§, B
.
§§B C
Get
§§C F
(
§§F G
	NOT_FOUND
§§G P
)
§§P Q
;
§§Q R
ApiResponse
•• 
notFoundRes
••  +
=
••, -
new
••. 1
ApiResponse
••2 =
(
••= >
)
••> ?
{
¶¶ 
userMessage
ßß #
=
ßß$ %
new
ßß& )
UserMessage
ßß* 5
{
ßß6 7
messageContent
ßß8 F
=
ßßG H
new
ßßI L
MessageContent
ßßM [
{
ßß\ ]
messageType
ßß^ i
=
ßßj k
notFoundMSG
ßßl w
.
ßßw x
messageTypeßßx É
,ßßÉ Ñ
messageCodeßßÖ ê
=ßßë í
notFoundMSGßßì û
.ßßû ü
messageCodeßßü ™
,ßß™ ´
messageßß¨ ≥
=ßß¥ µ
stringßß∂ º
.ßßº Ω
FormatßßΩ √
(ßß√ ƒ
notFoundMSGßßƒ œ
.ßßœ –
messageßß– ◊
,ßß◊ ÿ
REPORT_DETAILSßßŸ Á
)ßßÁ Ë
}ßßÈ Í
}ßßÎ Ï
}
®® 
;
®® 
return
©© 
NotFound
©© #
(
©©# $
notFoundRes
©©$ /
)
©©/ 0
;
©©0 1
}
™™ 
var
¨¨ 
reportApiURL
¨¨  
=
¨¨! "
_constantPath
¨¨# 0
.
¨¨0 1
ReportApiURL
¨¨1 =
+
¨¨> ?)
CHECK_STATUS_OF_REPORT_FILE
¨¨@ [
;
¨¨[ \
string
≠≠  
authorizationToken
≠≠ )
=
≠≠* +
HttpContext
≠≠, 7
.
≠≠7 8
Request
≠≠8 ?
.
≠≠? @
Headers
≠≠@ G
[
≠≠G H
$str
≠≠H W
]
≠≠W X
;
≠≠X Y
string
ÆÆ 
[
ÆÆ 
]
ÆÆ 
authorsList
ÆÆ $
=
ÆÆ% & 
authorizationToken
ÆÆ' 9
.
ÆÆ9 :
Split
ÆÆ: ?
(
ÆÆ? @
$str
ÆÆ@ C
)
ÆÆC D
;
ÆÆD E
HttpClientHandler
∞∞ !
handler
∞∞" )
=
∞∞* +
new
∞∞, /
HttpClientHandler
∞∞0 A
{
±± 7
)ServerCertificateCustomValidationCallback
≤≤ =
=
≤≤> ?
(
≤≤@ A 
httpRequestMessage
≤≤A S
,
≤≤S T
cert
≤≤U Y
,
≤≤Y Z
cetChain
≤≤[ c
,
≤≤c d
policyErrors
≤≤e q
)
≤≤q r
=>
≤≤s u
{
≤≤v w
return
≤≤x ~
true≤≤ É
;≤≤É Ñ
}≤≤Ö Ü
}
≥≥ 
;
≥≥ 

HttpClient
µµ 
client
µµ !
=
µµ" #
Startup
µµ$ +
.
µµ+ ,
islocalhost
µµ, 7
?
µµ8 9
new
µµ: =

HttpClient
µµ> H
(
µµH I
handler
µµI P
)
µµP Q
:
µµR S
new
µµT W

HttpClient
µµX b
(
µµb c
)
µµc d
;
µµd e
client
∂∂ 
.
∂∂ #
DefaultRequestHeaders
∂∂ ,
.
∂∂, -
Authorization
∂∂- :
=
∂∂; <
new
∂∂= @'
AuthenticationHeaderValue
∂∂A Z
(
∂∂Z [
$str
∂∂[ c
,
∂∂c d
authorsList
∂∂e p
[
∂∂p q
$num
∂∂q r
]
∂∂r s
)
∂∂s t
;
∂∂t u
var
∏∏ 
	urlstring
∏∏ 
=
∏∏ 
reportApiURL
∏∏  ,
+
∏∏- .
$str
∏∏/ ;
+
∏∏< =
reportmaster
∏∏> J
.
∏∏J K
fileName
∏∏K S
+
∏∏T U
$str
∏∏V i
+
∏∏j k
reportmaster
∏∏l x
.
∏∏x y
isEndUserReport∏∏y à
+∏∏â ä
$str∏∏ã £
+∏∏§ •
reportmaster∏∏¶ ≤
.∏∏≤ ≥$
reportGenerationType∏∏≥ «
;∏∏« »
var
ππ 
response
ππ 
=
ππ 
await
ππ $
client
ππ% +
.
ππ+ ,
GetAsync
ππ, 4
(
ππ4 5
	urlstring
ππ5 >
)
ππ> ?
;
ππ? @
response
∫∫ 
.
∫∫ %
EnsureSuccessStatusCode
∫∫ 0
(
∫∫0 1
)
∫∫1 2
;
∫∫2 3
var
ªª !
responseModelString
ªª '
=
ªª( )
await
ªª* /
response
ªª0 8
.
ªª8 9
Content
ªª9 @
.
ªª@ A
ReadAsStringAsync
ªªA R
(
ªªR S
)
ªªS T
;
ªªT U
var
ΩΩ 
responseModel
ΩΩ !
=
ΩΩ" #
(
ΩΩ$ %
ResponseModel
ΩΩ% 2
)
ΩΩ2 3
(
ΩΩ3 4
(
ΩΩ4 5

Newtonsoft
ΩΩ5 ?
.
ΩΩ? @
Json
ΩΩ@ D
.
ΩΩD E
Linq
ΩΩE I
.
ΩΩI J
JObject
ΩΩJ Q
)
ΩΩQ R

Newtonsoft
ΩΩR \
.
ΩΩ\ ]
Json
ΩΩ] a
.
ΩΩa b
JsonConvert
ΩΩb m
.
ΩΩm n
DeserializeObject
ΩΩn 
(ΩΩ Ä#
responseModelStringΩΩÄ ì
)ΩΩì î
)ΩΩî ï
.ΩΩï ñ
ToObject
ææ  
(
ææ  !
typeof
ææ! '
(
ææ' (
ResponseModel
ææ( 5
)
ææ5 6
)
ææ6 7
;
ææ7 8
if
øø 
(
øø 
responseModel
øø !
.
øø! "
	IsSuccess
øø" +
==
øø, .
false
øø/ 4
||
øø5 7
(
øø8 9
bool
øø9 =
)
øø= >
responseModel
øø> K
.
øøK L
Model
øøL Q
==
øøR T
false
øøU Z
)
øøZ [
{
¿¿ 
var
¡¡ 
notFoundMSG
¡¡ #
=
¡¡$ %
await
¡¡& +$
_dynamicMessageService
¡¡, B
.
¡¡B C
Get
¡¡C F
(
¡¡F G
	NOT_FOUND
¡¡G P
)
¡¡P Q
;
¡¡Q R
var
¬¬ 
somethingWrongMSG
¬¬ )
=
¬¬* +
await
¬¬, 1$
_dynamicMessageService
¬¬2 H
.
¬¬H I
Get
¬¬I L
(
¬¬L M
SOMTHING_WRONG
¬¬M [
)
¬¬[ \
;
¬¬\ ]
ApiResponse
√√ 
apiResponse
√√  +
=
√√, -
new
√√. 1
ApiResponse
√√2 =
(
√√= >
)
√√> ?
{
ƒƒ 
userMessage
≈≈ #
=
≈≈$ %
new
≈≈& )
UserMessage
≈≈* 5
{
≈≈6 7
messageContent
≈≈8 F
=
≈≈G H
new
≈≈I L
MessageContent
≈≈M [
{
≈≈\ ]
messageType
≈≈^ i
=
≈≈j k
responseModel
≈≈l y
.
≈≈y z
	IsSuccess≈≈z É
?≈≈Ñ Ö
notFoundMSG≈≈Ü ë
.≈≈ë í
messageType≈≈í ù
:≈≈û ü!
somethingWrongMSG≈≈† ±
.≈≈± ≤
messageType≈≈≤ Ω
,≈≈Ω æ
messageCode≈≈ø  
=≈≈À Ã
responseModel≈≈Õ ⁄
.≈≈⁄ €
	IsSuccess≈≈€ ‰
?≈≈Â Ê
notFoundMSG≈≈Á Ú
.≈≈Ú Û
messageCode≈≈Û ˛
:≈≈ˇ Ä!
somethingWrongMSG≈≈Å í
.≈≈í ì
messageCode≈≈ì û
,≈≈û ü
message≈≈† ß
=≈≈® ©
responseModel≈≈™ ∑
.≈≈∑ ∏
	IsSuccess≈≈∏ ¡
?≈≈¬ √
string≈≈ƒ  
.≈≈  À
Format≈≈À —
(≈≈— “
notFoundMSG≈≈“ ›
.≈≈› ﬁ
message≈≈ﬁ Â
,≈≈Â Ê
$str≈≈Á Ù
)≈≈Ù ı
:≈≈ˆ ˜!
somethingWrongMSG≈≈¯ â
.≈≈â ä
message≈≈ä ë
}≈≈í ì
}≈≈î ï
}
∆∆ 
;
∆∆ 
return
«« 

StatusCode
«« %
(
««% &
responseModel
««& 3
.
««3 4
	IsSuccess
««4 =
?
««> ?
$num
««@ C
:
««D E
$num
««F I
,
««I J
apiResponse
««K V
)
««V W
;
««W X
}
»» 
var
   
getByteDataURL
   "
=
  # $
_constantPath
  % 2
.
  2 3
ReportApiURL
  3 ?
+
  @ A"
GET_REPORT_BYTE_DATA
  B V
;
  V W
	urlstring
ÀÀ 
=
ÀÀ 
getByteDataURL
ÀÀ *
+
ÀÀ+ ,
$str
ÀÀ- 9
+
ÀÀ: ;
reportmaster
ÀÀ< H
.
ÀÀH I
fileName
ÀÀI Q
+
ÀÀR S
$str
ÀÀT g
+
ÀÀh i
reportmaster
ÀÀj v
.
ÀÀv w
isEndUserReportÀÀw Ü
+ÀÀá à
$strÀÀâ °
+ÀÀ¢ £
reportmasterÀÀ§ ∞
.ÀÀ∞ ±$
reportGenerationTypeÀÀ± ≈
;ÀÀ≈ ∆
response
ÃÃ 
=
ÃÃ 
await
ÃÃ  
client
ÃÃ! '
.
ÃÃ' (
GetAsync
ÃÃ( 0
(
ÃÃ0 1
	urlstring
ÃÃ1 :
)
ÃÃ: ;
;
ÃÃ; <
response
ÕÕ 
.
ÕÕ %
EnsureSuccessStatusCode
ÕÕ 0
(
ÕÕ0 1
)
ÕÕ1 2
;
ÕÕ2 3!
responseModelString
ŒŒ #
=
ŒŒ$ %
await
ŒŒ& +
response
ŒŒ, 4
.
ŒŒ4 5
Content
ŒŒ5 <
.
ŒŒ< =
ReadAsStringAsync
ŒŒ= N
(
ŒŒN O
)
ŒŒO P
;
ŒŒP Q
responseModel
œœ 
=
œœ 
(
œœ  !
ResponseModel
œœ! .
)
œœ. /
(
œœ/ 0
(
œœ0 1

Newtonsoft
œœ1 ;
.
œœ; <
Json
œœ< @
.
œœ@ A
Linq
œœA E
.
œœE F
JObject
œœF M
)
œœM N

Newtonsoft
œœN X
.
œœX Y
Json
œœY ]
.
œœ] ^
JsonConvert
œœ^ i
.
œœi j
DeserializeObject
œœj {
(
œœ{ |"
responseModelStringœœ| è
)œœè ê
)œœê ë
.œœë í
ToObject
––  
(
––  !
typeof
––! '
(
––' (
ResponseModel
––( 5
)
––5 6
)
––6 7
;
––7 8
if
—— 
(
—— 
responseModel
—— !
.
——! "
	IsSuccess
——" +
==
——, .
false
——/ 4
)
——4 5
{
““ 
ApiResponse
”” 
apiResponse
””  +
=
””, -
new
””. 1
ApiResponse
””2 =
(
””= >
)
””> ?
{
‘‘ 
userMessage
’’ #
=
’’$ %
new
’’& )
UserMessage
’’* 5
{
’’6 7
message
’’8 ?
=
’’@ A
responseModel
’’B O
.
’’O P
Message
’’P W
}
’’X Y
}
÷÷ 
;
÷÷ 
return
◊◊ 

StatusCode
◊◊ %
(
◊◊% &
responseModel
◊◊& 3
.
◊◊3 4

StatusCode
◊◊4 >
,
◊◊> ?
apiResponse
◊◊@ K
)
◊◊K L
;
◊◊L M
}
ÿÿ 
ReportByteDataVM
ŸŸ  
reportByteDataVM
ŸŸ! 1
=
ŸŸ2 3
(
ŸŸ4 5
ReportByteDataVM
ŸŸ5 E
)
ŸŸE F
(
ŸŸF G
(
ŸŸG H

Newtonsoft
ŸŸH R
.
ŸŸR S
Json
ŸŸS W
.
ŸŸW X
Linq
ŸŸX \
.
ŸŸ\ ]
JObject
ŸŸ] d
)
ŸŸd e

Newtonsoft
ŸŸe o
.
ŸŸo p
Json
ŸŸp t
.
ŸŸt u
JsonConvertŸŸu Ä
.ŸŸÄ Å!
DeserializeObjectŸŸÅ í
(ŸŸí ì
responseModelŸŸì †
.ŸŸ† °
ModelŸŸ° ¶
.ŸŸ¶ ß
ToStringŸŸß Ø
(ŸŸØ ∞
)ŸŸ∞ ±
)ŸŸ± ≤
)ŸŸ≤ ≥
.ŸŸ≥ ¥
ToObject
⁄⁄  
(
⁄⁄  !
typeof
⁄⁄! '
(
⁄⁄' (
ReportByteDataVM
⁄⁄( 8
)
⁄⁄8 9
)
⁄⁄9 :
;
⁄⁄: ;
var
€€ 
reportByteData
€€ "
=
€€# $
reportByteDataVM
€€% 5
.
€€5 6
ReportByteData
€€6 D
;
€€D E
var
‹‹ 
companyInfo
‹‹ 
=
‹‹  !
await
‹‹" '
_FJTSqlDBContext
‹‹( 8
.
‹‹8 9
CompanyInfos
‹‹9 E
.
‹‹E F
Include
‹‹F M
(
‹‹M N
x
‹‹N O
=>
‹‹P R
x
‹‹S T
.
‹‹T U

Mfgcodemst
‹‹U _
)
‹‹_ `
.
‹‹` a
Select
‹‹a g
(
‹‹g h
x
‹‹h i
=>
‹‹j l
new
‹‹m p
{
‹‹q r
x
‹‹s t
.
‹‹t u

Mfgcodemst
‹‹u 
.‹‹ Ä
mfgCode‹‹Ä á
}‹‹à â
)‹‹â ä
.‹‹ä ã#
FirstOrDefaultAsync‹‹ã û
(‹‹û ü
)‹‹ü †
;‹‹† °
var
ﬂﬂ 
report
ﬂﬂ 
=
ﬂﬂ 
new
ﬂﬂ  
	StiReport
ﬂﬂ! *
(
ﬂﬂ* +
)
ﬂﬂ+ ,
;
ﬂﬂ, -
report
‡‡ 
.
‡‡ 
Load
‡‡ 
(
‡‡ 
reportByteData
‡‡ *
)
‡‡* +
;
‡‡+ ,
report
·· 
.
·· 

ReportName
·· !
=
··" ##
reportviewerparameter
··$ 9
.
··9 :

reportName
··: D
!=
··E G
null
··H L
?
··M N
companyInfo
··O Z
.
··Z [
mfgCode
··[ b
+
··c d#
reportviewerparameter
··e z
.
··z {

reportName··{ Ö
:··Ü á
reportmaster··à î
.··î ï

reportName··ï ü
;··ü †
StiDictionary
‚‚ 

dictionary
‚‚ (
=
‚‚) *
report
‚‚+ 1
.
‚‚1 2

Dictionary
‚‚2 <
;
‚‚< =
var
ÂÂ 
dbList
ÂÂ 
=
ÂÂ 

dictionary
ÂÂ '
.
ÂÂ' (
	Databases
ÂÂ( 1
.
ÂÂ1 2
ToList
ÂÂ2 8
(
ÂÂ8 9
)
ÂÂ9 :
;
ÂÂ: ;
for
ÊÊ 
(
ÊÊ 
int
ÊÊ 
i
ÊÊ 
=
ÊÊ 
$num
ÊÊ 
;
ÊÊ 
i
ÊÊ  !
<
ÊÊ" #
dbList
ÊÊ$ *
.
ÊÊ* +
Count
ÊÊ+ 0
;
ÊÊ0 1
i
ÊÊ2 3
++
ÊÊ3 5
)
ÊÊ5 6
{
ÁÁ 
(
ËË 
(
ËË 
StiSqlDatabase
ËË $
)
ËË$ %

dictionary
ËË% /
.
ËË/ 0
	Databases
ËË0 9
[
ËË9 :
i
ËË: ;
]
ËË; <
)
ËË< =
.
ËË= >
ConnectionString
ËË> N
=
ËËO P 
_connectionStrings
ËËQ c
.
ËËc d
ReportConnection
ËËd t
;
ËËt u
}
ÈÈ 
var
ÏÏ 
variableList
ÏÏ  
=
ÏÏ! "

dictionary
ÏÏ# -
.
ÏÏ- .
	Variables
ÏÏ. 7
.
ÏÏ7 8
ToList
ÏÏ8 >
(
ÏÏ> ?
)
ÏÏ? @
;
ÏÏ@ A
foreach
ÌÌ 
(
ÌÌ 
var
ÌÌ 
item
ÌÌ !
in
ÌÌ" $
variableList
ÌÌ% 1
)
ÌÌ1 2
{
ÓÓ 
item
ÔÔ 
.
ÔÔ 
Value
ÔÔ 
=
ÔÔ  
null
ÔÔ! %
;
ÔÔ% &
}
 
foreach
ÛÛ 
(
ÛÛ 
var
ÛÛ 
variableName
ÛÛ )
in
ÛÛ* ,
Enum
ÛÛ- 1
.
ÛÛ1 2
GetNames
ÛÛ2 :
(
ÛÛ: ;
typeof
ÛÛ; A
(
ÛÛA B$
ConstantReportVariable
ÛÛB X
)
ÛÛX Y
)
ÛÛY Z
)
ÛÛZ [
{
ÙÙ 
if
ıı 
(
ıı 
report
ıı 
.
ıı 
IsVariableExist
ıı .
(
ıı. /
variableName
ıı/ ;
)
ıı; <
)
ıı< =
{
ˆˆ $
ConstantReportVariable
˜˜ .
reportVariable
˜˜/ =
=
˜˜> ?
(
˜˜@ A$
ConstantReportVariable
˜˜A W
)
˜˜W X
Enum
˜˜X \
.
˜˜\ ]
Parse
˜˜] b
(
˜˜b c
typeof
˜˜c i
(
˜˜i j%
ConstantReportVariable˜˜j Ä
)˜˜Ä Å
,˜˜Å Ç
variableName˜˜É è
)˜˜è ê
;˜˜ê ë

dictionary
¯¯ "
.
¯¯" #
	Variables
¯¯# ,
[
¯¯, -
variableName
¯¯- 9
]
¯¯9 :
.
¯¯: ;
Value
¯¯; @
=
¯¯A B
reportVariable
¯¯C Q
.
¯¯Q R
GetDisplayValue
¯¯R a
(
¯¯a b
)
¯¯b c
;
¯¯c d
}
˘˘ 
}
˙˙ 
FilterParameters
˝˝  
filterParameters
˝˝! 1
=
˝˝2 3
(
˝˝4 5
FilterParameters
˝˝5 E
)
˝˝E F
(
˝˝F G
(
˝˝G H

Newtonsoft
˝˝H R
.
˝˝R S
Json
˝˝S W
.
˝˝W X
Linq
˝˝X \
.
˝˝\ ]
JObject
˝˝] d
)
˝˝d e

Newtonsoft
˝˝e o
.
˝˝o p
Json
˝˝p t
.
˝˝t u
JsonConvert˝˝u Ä
.˝˝Ä Å!
DeserializeObject˝˝Å í
(˝˝í ì%
reportviewerparameter˝˝ì ®
.˝˝® ©
parameterValues˝˝© ∏
)˝˝∏ π
)˝˝π ∫
.˝˝∫ ª
ToObject
˛˛< D
(
˛˛D E
typeof
˛˛E K
(
˛˛K L
FilterParameters
˛˛L \
)
˛˛\ ]
)
˛˛] ^
;
˛˛^ _
PropertyInfo
ÖÖ 
[
ÖÖ 
]
ÖÖ (
filterParametersProperties
ÖÖ 9
=
ÖÖ: ;
filterParameters
ÖÖ< L
.
ÖÖL M
GetType
ÖÖM T
(
ÖÖT U
)
ÖÖU V
.
ÖÖV W
GetProperties
ÖÖW d
(
ÖÖd e
)
ÖÖe f
;
ÖÖf g
var
áá '
reportmasterparameterList
áá -
=
áá. /
await
áá0 5
_FJTSqlDBContext
áá6 F
.
ááF G#
reportmasterparameter
ááG \
.
áá\ ]
Where
áá] b
(
ááb c
x
áác d
=>
ááe g
x
ááh i
.
áái j
reportId
ááj r
==
áás u
reportmasterááv Ç
.ááÇ É
idááÉ Ö
&&ááÜ à
xááâ ä
.ááä ã
	isDeletedááã î
==ááï ó
falseááò ù
)ááù û
.ááû ü
Selectááü •
(áá• ¶
xáá¶ ß
=>áá® ™
xáá´ ¨
.áá¨ ≠!
parmeterMappingidáá≠ æ
)ááæ ø
.ááø ¿
ToListAsyncáá¿ À
(ááÀ Ã
)ááÃ Õ
;ááÕ Œ
var
àà  
param_DbColumnList
àà &
=
àà' (
await
àà) .
_FJTSqlDBContext
àà/ ?
.
àà? @.
 report_parameter_setting_mapping
àà@ `
.
àà` a
Where
ààa f
(
ààf g
x
ààg h
=>
àài k(
reportmasterparameterListààl Ö
.ààÖ Ü
AnyààÜ â
(ààâ ä
paramIdààä ë
=>ààí î
xààï ñ
.ààñ ó
idààó ô
==ààö ú
paramIdààù §
)àà§ •
)àà• ¶
.àà¶ ß
Selectààß ≠
(àà≠ Æ
xààÆ Ø
=>àà∞ ≤
newàà≥ ∂
{àà∑ ∏
xààπ ∫
.àà∫ ª
reportParamNameààª  
,àà  À
xààÃ Õ
.ààÕ Œ
dbColumnNameààŒ ⁄
}àà€ ‹
)àà‹ ›
.àà› ﬁ
ToListAsyncààﬁ È
(ààÈ Í
)ààÍ Î
;ààÎ Ï
foreach
ää 
(
ää 
var
ää 
item
ää !
in
ää" $ 
param_DbColumnList
ää% 7
)
ää7 8
{
ãã 
var
åå 
valueObj
åå  
=
åå! "(
filterParametersProperties
åå# =
.
åå= >
Where
åå> C
(
ååC D
x
ååD E
=>
ååF H
x
ååI J
.
ååJ K
Name
ååK O
==
ååP R
item
ååS W
.
ååW X
dbColumnName
ååX d
)
ååd e
.
ååe f
Select
ååf l
(
åål m
x
ååm n
=>
ååo q
x
åår s
.
åås t
GetValue
ååt |
(
åå| }
filterParametersåå} ç
)ååç é
)ååé è
.ååè ê
FirstOrDefaultååê û
(ååû ü
)ååü †
;åå† °
var
çç 

paramValue
çç "
=
çç# $
string
çç% +
.
çç+ ,
Empty
çç, 1
;
çç1 2
if
éé 
(
éé 
valueObj
éé  
!=
éé! #
null
éé$ (
)
éé( )
{
èè 

paramValue
êê "
=
êê# $
valueObj
êê% -
.
êê- .
ToString
êê. 6
(
êê6 7
)
êê7 8
;
êê8 9
}
ëë 
if
íí 
(
íí 
report
íí 
.
íí 
IsVariableExist
íí .
(
íí. /
item
íí/ 3
.
íí3 4
reportParamName
íí4 C
)
ííC D
)
ííD E
{
ìì 

dictionary
îî "
.
îî" #
	Variables
îî# ,
[
îî, -
item
îî- 1
.
îî1 2
reportParamName
îî2 A
]
îîA B
.
îîB C
Value
îîC H
=
îîI J

paramValue
îîK U
;
îîU V
}
ïï 
else
ññ 
{
óó 

dictionary
òò "
.
òò" #
	Variables
òò# ,
.
òò, -
Add
òò- 0
(
òò0 1
$str
òò1 3
,
òò3 4
item
òò5 9
.
òò9 :
reportParamName
òò: I
,
òòI J
item
òòK O
.
òòO P
dbColumnName
òòP \
,
òò\ ]

paramValue
òò^ h
)
òòh i
;
òòi j
}
ôô 
}
öö 
if
úú 
(
úú 
report
úú 
.
úú 
IsVariableExist
úú *
(
úú* +
PARA_REPORT_TITLE
úú+ <
)
úú< =
)
úú= >
{
ùù 

dictionary
ûû 
.
ûû 
	Variables
ûû (
[
ûû( )
PARA_REPORT_TITLE
ûû) :
]
ûû: ;
.
ûû; <
Value
ûû< A
=
ûûB C
reportmaster
ûûD P
.
ûûP Q
reportTitle
ûûQ \
;
ûû\ ]
}
üü 
if
†† 
(
†† 
report
†† 
.
†† 
IsVariableExist
†† *
(
††* +!
PARA_REPORT_VERSION
††+ >
)
††> ?
)
††? @
{
°° 

dictionary
¢¢ 
.
¢¢ 
	Variables
¢¢ (
[
¢¢( )!
PARA_REPORT_VERSION
¢¢) <
]
¢¢< =
.
¢¢= >
Value
¢¢> C
=
¢¢D E
reportmaster
¢¢F R
.
¢¢R S
reportVersion
¢¢S `
??
¢¢a c
$str
¢¢d g
;
¢¢g h
}
££ 
if
§§ 
(
§§ 
report
§§ 
.
§§ 
IsVariableExist
§§ *
(
§§* +'
Para_ROHS_ImageFolderPath
§§+ D
)
§§D E
)
§§E F
{
•• 

dictionary
¶¶ 
.
¶¶ 
	Variables
¶¶ (
[
¶¶( )'
Para_ROHS_ImageFolderPath
¶¶) B
]
¶¶B C
.
¶¶C D
Value
¶¶D I
=
¶¶J K
string
¶¶L R
.
¶¶R S
Concat
¶¶S Y
(
¶¶Y Z
_constantPath
¶¶Z g
.
¶¶g h
APIURL
¶¶h n
,
¶¶n o
_constantPath
¶¶p }
.
¶¶} ~
RoHSImagesPath¶¶~ å
)¶¶å ç
;¶¶ç é
}
ßß 
return
©© &
StiNetCoreReportResponse
©© /
.
©©/ 0
ResponseAsPdf
©©0 =
(
©©= >
report
©©> D
)
©©D E
;
©©E F
}
™™ 
catch
´´ 
(
´´ 
	Exception
´´ 
e
´´ 
)
´´ 
{
¨¨ 
_logger
≠≠ 
.
≠≠ 
LogError
≠≠  
(
≠≠  !
e
≠≠! "
.
≠≠" #
ToString
≠≠# +
(
≠≠+ ,
)
≠≠, -
)
≠≠- .
;
≠≠. /
var
ÆÆ 
somethingWrongMSG
ÆÆ %
=
ÆÆ& '
await
ÆÆ( -$
_dynamicMessageService
ÆÆ. D
.
ÆÆD E
Get
ÆÆE H
(
ÆÆH I
SOMTHING_WRONG
ÆÆI W
)
ÆÆW X
;
ÆÆX Y
ApiResponse
ØØ 
response
ØØ $
=
ØØ% &
new
ØØ' *
ApiResponse
ØØ+ 6
(
ØØ6 7
)
ØØ7 8
{
∞∞ 
userMessage
±± 
=
±±  !
new
±±" %
UserMessage
±±& 1
{
±±2 3
messageContent
±±4 B
=
±±C D
new
±±E H
MessageContent
±±I W
{
±±X Y
messageType
±±Z e
=
±±f g
somethingWrongMSG
±±h y
.
±±y z
messageType±±z Ö
,±±Ö Ü
messageCode±±á í
=±±ì î!
somethingWrongMSG±±ï ¶
.±±¶ ß
messageCode±±ß ≤
,±±≤ ≥
message±±¥ ª
=±±º Ω!
somethingWrongMSG±±æ œ
.±±œ –
message±±– ◊
,±±◊ ÿ
err±±Ÿ ‹
=±±› ﬁ
new±±ﬂ ‚
ErrorVM±±„ Í
{±±Î Ï
message±±Ì Ù
=±±ı ˆ
e±±˜ ¯
.±±¯ ˘
Message±±˘ Ä
,±±Ä Å
stack±±Ç á
=±±à â
e±±ä ã
.±±ã å

StackTrace±±å ñ
}±±ó ò
}±±ô ö
}±±õ ú
}
≤≤ 
;
≤≤ 
return
≥≥ 

StatusCode
≥≥ !
(
≥≥! "
(
≥≥" #
int
≥≥# &
)
≥≥& '
APIStatusCode
≥≥' 4
.
≥≥4 5#
INTERNAL_SERVER_ERROR
≥≥5 J
,
≥≥J K
response
≥≥L T
)
≥≥T U
;
≥≥U V
}
¥¥ 
}
µµ 	
[
ºº 	
Route
ºº	 
(
ºº 
$str
ºº *
)
ºº* +
]
ºº+ ,
[
ΩΩ 	
	Authorize
ΩΩ	 
(
ΩΩ #
AuthenticationSchemes
ΩΩ (
=
ΩΩ) *
JwtBearerDefaults
ΩΩ+ <
.
ΩΩ< ="
AuthenticationScheme
ΩΩ= Q
)
ΩΩQ R
]
ΩΩR S
[
ææ 	
HttpPost
ææ	 
]
ææ 
public
øø 
async
øø 
Task
øø 
<
øø 
IActionResult
øø '
>
øø' ('
SaveReportViewerParameter
øø) B
(
øøB C
[
øøC D
FromBody
øøD L
]
øøL M&
RequestFilterParameterVM
øøN f%
reportviewerparameterVM
øøg ~
)
øø~ 
{
¿¿ 	
if
¡¡ 
(
¡¡ %
reportviewerparameterVM
¡¡ '
==
¡¡( *
null
¡¡+ /
||
¡¡0 2%
reportviewerparameterVM
¡¡3 J
.
¡¡J K
id
¡¡K M
==
¡¡N P
$num
¡¡Q R
)
¡¡R S
{
¬¬ 
var
√√ !
invalidParameterMSG
√√ '
=
√√( )
await
√√* /$
_dynamicMessageService
√√0 F
.
√√F G
Get
√√G J
(
√√J K
INVALID_PARAMETER
√√K \
)
√√\ ]
;
√√] ^
return
ƒƒ '
_iHttpsResponseRepository
ƒƒ 0
.
ƒƒ0 1
ReturnResult
ƒƒ1 =
(
ƒƒ= >
APIStatusCode
ƒƒ> K
.
ƒƒK L
ERROR
ƒƒL Q
,
ƒƒQ R
APIState
ƒƒS [
.
ƒƒ[ \
FAILED
ƒƒ\ b
,
ƒƒb c
null
ƒƒd h
,
ƒƒh i
new
ƒƒj m
UserMessage
ƒƒn y
(
ƒƒy z
)
ƒƒz {
{
ƒƒ| }
messageContentƒƒ~ å
=ƒƒç é
newƒƒè í
MessageContentƒƒì °
{ƒƒ¢ £
messageTypeƒƒ§ Ø
=ƒƒ∞ ±#
invalidParameterMSGƒƒ≤ ≈
.ƒƒ≈ ∆
messageTypeƒƒ∆ —
,ƒƒ— “
messageCodeƒƒ” ﬁ
=ƒƒﬂ ‡#
invalidParameterMSGƒƒ· Ù
.ƒƒÙ ı
messageCodeƒƒı Ä
,ƒƒÄ Å
messageƒƒÇ â
=ƒƒä ã#
invalidParameterMSGƒƒå ü
.ƒƒü †
messageƒƒ† ß
}ƒƒ® ©
}ƒƒ™ ´
)ƒƒ´ ¨
;ƒƒ¨ ≠
}
≈≈ 
try
∆∆ 
{
«« #
reportviewerparameter
»» %#
reportviewerparameter
»»& ;
=
»»< =
new
»»> A#
reportviewerparameter
»»B W
{
…… 
parameterGUID
   !
=
  " #
Guid
  $ (
.
  ( )
NewGuid
  ) 0
(
  0 1
)
  1 2
,
  2 3
reportId
ÀÀ 
=
ÀÀ %
reportviewerparameterVM
ÀÀ 6
.
ÀÀ6 7
id
ÀÀ7 9
,
ÀÀ9 :

reportName
ÃÃ 
=
ÃÃ  %
reportviewerparameterVM
ÃÃ! 8
.
ÃÃ8 9

reportName
ÃÃ9 C
,
ÃÃC D
parameterValues
ÕÕ #
=
ÕÕ$ %%
reportviewerparameterVM
ÕÕ& =
.
ÕÕ= > 
parameterValueJson
ÕÕ> P
,
ÕÕP Q
	createdBy
ŒŒ 
=
ŒŒ %
reportviewerparameterVM
ŒŒ  7
.
ŒŒ7 8
	createdBy
ŒŒ8 A
,
ŒŒA B
	updatedBy
œœ 
=
œœ %
reportviewerparameterVM
œœ  7
.
œœ7 8
	updatedBy
œœ8 A
,
œœA B
	createdAt
–– 
=
–– 
StaticMethods
––  -
.
––- .
GetUtcDateTime
––. <
(
––< =
)
––= >
,
––> ?
	updatedAt
—— 
=
—— 
StaticMethods
——  -
.
——- .
GetUtcDateTime
——. <
(
——< =
)
——= >
,
——> ?
createByRoleId
““ "
=
““# $%
reportviewerparameterVM
““% <
.
““< =
createByRoleId
““= K
,
““K L
updateByRoleId
”” "
=
””# $%
reportviewerparameterVM
””% <
.
””< =
updateByRoleId
””= K
,
””K L
deleteByRoleId
‘‘ "
=
‘‘# $%
reportviewerparameterVM
‘‘% <
.
‘‘< =
deleteByRoleId
‘‘= K
}
’’ 
;
’’ 
_FJTSqlDBContext
÷÷  
.
÷÷  !#
reportviewerparameter
÷÷! 6
.
÷÷6 7
Add
÷÷7 :
(
÷÷: ;#
reportviewerparameter
÷÷; P
)
÷÷P Q
;
÷÷Q R
await
◊◊ 
_FJTSqlDBContext
◊◊ &
.
◊◊& '
SaveChangesAsync
◊◊' 7
(
◊◊7 8
)
◊◊8 9
;
◊◊9 :
return
ŸŸ '
_iHttpsResponseRepository
ŸŸ 0
.
ŸŸ0 1
ReturnResult
ŸŸ1 =
(
ŸŸ= >
APIStatusCode
ŸŸ> K
.
ŸŸK L
SUCCESS
ŸŸL S
,
ŸŸS T
APIState
ŸŸU ]
.
ŸŸ] ^
SUCCESS
ŸŸ^ e
,
ŸŸe f#
reportviewerparameter
ŸŸg |
.
ŸŸ| }
parameterGUIDŸŸ} ä
,ŸŸä ã
nullŸŸå ê
)ŸŸê ë
;ŸŸë í
}
⁄⁄ 
catch
€€ 
(
€€ 
	Exception
€€ 
e
€€ 
)
€€ 
{
‹‹ 
_logger
›› 
.
›› 
LogError
››  
(
››  !
e
››! "
.
››" #
ToString
››# +
(
››+ ,
)
››, -
)
››- .
;
››. /
return
ﬁﬁ 
await
ﬁﬁ '
_iHttpsResponseRepository
ﬁﬁ 6
.
ﬁﬁ6 7%
ReturnExceptionResponse
ﬁﬁ7 N
(
ﬁﬁN O
e
ﬁﬁO P
)
ﬁﬁP Q
;
ﬁﬁQ R
}
ﬂﬂ 
}
‡‡ 	
public
‚‚ 
async
‚‚ 
Task
‚‚ 
<
‚‚ 
IActionResult
‚‚ '
>
‚‚' (
Error
‚‚) .
(
‚‚. /
)
‚‚/ 0
{
„„ 	
var
‰‰ 
somethingWrongMSG
‰‰ !
=
‰‰" #
await
‰‰$ )$
_dynamicMessageService
‰‰* @
.
‰‰@ A
Get
‰‰A D
(
‰‰D E
SOMTHING_WRONG
‰‰E S
)
‰‰S T
;
‰‰T U
return
ÂÂ 
View
ÂÂ 
(
ÂÂ 
new
ÂÂ 
ErrorViewModel
ÂÂ *
{
ÂÂ+ ,

StatusCode
ÂÂ- 7
=
ÂÂ8 9
(
ÂÂ: ;
int
ÂÂ; >
)
ÂÂ> ?
APIStatusCode
ÂÂ? L
.
ÂÂL M#
INTERNAL_SERVER_ERROR
ÂÂM b
,
ÂÂb c
Message
ÂÂd k
=
ÂÂl m
somethingWrongMSG
ÂÂn 
.ÂÂ Ä
messageÂÂÄ á
}ÂÂà â
)ÂÂâ ä
;ÂÂä ã
}
ÊÊ 	
}
ÁÁ 
}ËË ª
KD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Enums\ConstantReportVariable.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Enums  
{		 
public 

enum "
ConstantReportVariable &
{ 
[ 	
Display	 
( 
Name 
= 
$str	 ª
)
ª º
]
º Ω,
 Para_DeclarationOfRoHSCompliance (
,( )
[ 	
Display	 
( 
Name 
= 
$str	 á
)
á à
]
à â%
Para_COFCReportDisclaimer !
,! "
[ 	
Display	 
( 
Name 
= 
$str	 Ç
)
Ç É
]
É Ñ,
 Para_PACKINGSLIPReportDisclaimer (
,( )
[ 	
Display	 
( 
Name 
= 
$str	 °
)
° ¢
]
¢ £%
Para_RoHSReportDisclaimer !
} 
} ‰
CD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Enums\ReportCategory.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Enums  
{ 
public		 

enum		 
ReportCategory		 
{

 
[ 	
Display	 
( 
Name 
= 
$str %
)% &
]& '
SaticReport 
= 
$num 
, 
[ 	
Display	 
( 
Name 
= 
$str '
)' (
]( )
EndUserReport 
= 
$num 
, 
[ 	
Display	 
( 
Name 
= 
$str (
)( )
]) *
TemplateReport 
= 
$num 
, 
[ 	
Display	 
( 
Name 
= 
$str /
)/ 0
]0 1!
SystemGeneratedReport 
= 
$num  !
} 
} Ì
AD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Enums\ReportStatus.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Enums  
{ 
public		 

enum		 
ReportStatus		 
{

 
[ 	
Display	 
( 
Name 
= 
$str 
) 
] 
Draft 
, 
[ 	
Display	 
( 
Name 
= 
$str 
) 
] 
	Published 
} 
} è
DD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Helper\ConstantHelper.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Helper !
{ 
public		 

class		 
ConstantHelper		 
{

 
public 
enum 
APIStatusCode !
{ 	
SUCCESS 
= 
$num 
, 
ERROR 
= 
$num 
, 
BAD_REQUEST 
= 
$num 
, 
UNAUTHORIZED 
= 
$num 
, 
PAGE_NOT_FOUND 
= 
$num  
,  !
ACCESS_DENIED 
= 
$num 
,  !
INTERNAL_SERVER_ERROR !
=" #
$num$ '
} 	
public 
enum 
APIState 
{ 	
[ 
Display 
( 
Name 
= 
$str %
)% &
]& '
SUCCESS 
, 
[ 
Display 
( 
Name 
= 
$str $
)$ %
]% &
FAILED 
} 	
public 
const 
string 3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME C
=D E
$strF R
;R S
public 
const 
string 
PROJECT_NAME (
=) *
$str+ >
;> ?
public"" 
static"" 
string"" 

TOKEN_PATH"" '
=""( )
$str""* :
;"": ;
public## 
static## 
string## ,
 VALIDATE_CLIENT_USER_MAPPING_URL## =
=##> ?
$str##@ o
;##o p
public$$ 
static$$ 
string$$ '
CHECK_STATUS_OF_REPORT_FILE$$ 8
=$$9 :
$str$$; ^
;$$^ _
public%% 
static%% 
string%%  
GET_REPORT_BYTE_DATA%% 1
=%%2 3
$str%%4 Q
;%%Q R
public(( 
const(( 
string((  
REPORT_DATABASE_NAME(( 0
=((1 2
$str((3 >
;((> ?
public)) 
const)) 
string)) 
PARA_REPORT_TITLE)) -
=)). /
$str))0 B
;))B C
public** 
const** 
string** 
PARA_REPORT_VERSION** /
=**0 1
$str**2 G
;**G H
public++ 
const++ 
string++ %
Para_ROHS_ImageFolderPath++ 5
=++6 7
$str++8 S
;++S T
public.. 
static.. 
string.. 
REPORT_DETAILS.. +
=.., -
$str... ?
;..? @
public// 
static// 
string// 
REPORT_ENTITY// *
=//+ ,
$str//- 5
;//5 6
public00 
static00 
string00 
	REQUESTED00 &
=00' (
$str00) 4
;004 5
public33 
const33 
string33 
INVALID_PARAMETER33 -
=33. /
$str330 C
;33C D
public44 
const44 
string44 
SOMTHING_WRONG44 *
=44+ ,
$str44- =
;44= >
public55 
const55 
string55 
	NOT_FOUND55 %
=55& '
$str55( 3
;553 4
public66 
const66 
string66 
POPUP_ACCESS_DENIED66 /
=660 1
$str662 G
;66G H
public99 
const99 
string99 
LOGOUT_CONFIRMATION99 /
=990 1
$str992 
;	99 Ä
public;; 
const;; 
string;; $
MONGODB_CONNECTION_ERROR;; 4
=;;5 6
$str	;;7 Å
;
;;Å Ç
}<< 
}== á 
LD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Helper\MemoryCacheTicketStore.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Helper !
{ 
public 

class "
MemoryCacheTicketStore '
:( )
ITicketStore* 6
{ 
private 
const 
string 
	KeyPrefix &
=' (
$str) <
;< =
private 
IMemoryCache 
_cache #
;# $
public "
MemoryCacheTicketStore %
(% &
)& '
{ 	
_cache 
= 
new 
MemoryCache $
($ %
new% (
MemoryCacheOptions) ;
(; <
)< =
)= >
;> ?
} 	
public 
async 
Task 
< 
string  
>  !

StoreAsync" ,
(, - 
AuthenticationTicket- A
ticketB H
)H I
{ 	
var 
guid 
= 
Guid 
. 
NewGuid #
(# $
)$ %
;% &
var 
key 
= 
	KeyPrefix 
+  !
guid" &
.& '
ToString' /
(/ 0
)0 1
;1 2
await 

RenewAsync 
( 
key  
,  !
ticket" (
)( )
;) *
return 
key 
; 
} 	
public 
Task 

RenewAsync 
( 
string %
key& )
,) * 
AuthenticationTicket+ ?
ticket@ F
)F G
{   	
var!! 
options!! 
=!! 
new!! #
MemoryCacheEntryOptions!! 5
(!!5 6
)!!6 7
;!!7 8
var"" 

expiresUtc"" 
="" 
ticket"" #
.""# $

Properties""$ .
."". /

ExpiresUtc""/ 9
;""9 :
if## 
(## 

expiresUtc## 
.## 
HasValue## #
)### $
{$$ 
options%% 
.%% !
SetAbsoluteExpiration%% -
(%%- .

expiresUtc%%. 8
.%%8 9
Value%%9 >
)%%> ?
;%%? @
}&& 
options'' 
.''  
SetSlidingExpiration'' (
(''( )
TimeSpan'') 1
.''1 2
	FromHours''2 ;
(''; <
$num''< =
)''= >
)''> ?
;''? @
_cache)) 
.)) 
Set)) 
()) 
key)) 
,)) 
ticket)) "
,))" #
options))$ +
)))+ ,
;)), -
return++ 
Task++ 
.++ 

FromResult++ "
(++" #
$num++# $
)++$ %
;++% &
},, 	
public.. 
Task.. 
<..  
AuthenticationTicket.. (
>..( )
RetrieveAsync..* 7
(..7 8
string..8 >
key..? B
)..B C
{// 	 
AuthenticationTicket00  
ticket00! '
;00' (
_cache11 
.11 
TryGetValue11 
(11 
key11 "
,11" #
out11$ '
ticket11( .
)11. /
;11/ 0
return22 
Task22 
.22 

FromResult22 "
(22" #
ticket22# )
)22) *
;22* +
}33 	
public55 
Task55 
RemoveAsync55 
(55  
string55  &
key55' *
)55* +
{66 	
_cache77 
.77 
Remove77 
(77 
key77 
)77 
;77 
return88 
Task88 
.88 

FromResult88 "
(88" #
$num88# $
)88$ %
;88% &
}99 	
}:: 
};; ‘	
CD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Helper\ResponseModel.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Helper !
{ 
public 

class 
ResponseModel 
{		 
public 
bool 
	IsSuccess 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
Message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
object 
Model 
{ 
get !
;! "
set# &
;& '
}( )
public 
int 
	ListCount 
{ 
get "
;" #
set$ '
;' (
}) *
public"" 
int"" 
ActiveEmpCount"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
public$$ 
int$$ 

StatusCode$$ 
{$$ 
get$$  #
;$$# $
set$$% (
;$$( )
}$$* +
}%% 
}&& ö
CD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Helper\StaticMethods.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Helper !
{ 
public 

static 
class 
StaticMethods %
{ 
public 
static 
string 
GetDisplayValue ,
(, -
this- 1
Enum2 6
instance7 ?
)? @
{ 	
var 
	fieldInfo 
= 
instance $
.$ %
GetType% ,
(, -
)- .
.. /
	GetMember/ 8
(8 9
instance9 A
.A B
ToStringB J
(J K
)K L
)L M
.M N
SingleN T
(T U
)U V
;V W
var !
descriptionAttributes %
=& '
	fieldInfo( 1
.1 2
GetCustomAttributes2 E
(E F
typeofF L
(L M
DisplayAttributeM ]
)] ^
,^ _
false` e
)e f
asg i
DisplayAttributej z
[z {
]{ |
;| }
if 
( !
descriptionAttributes %
==& (
null) -
)- .
return/ 5
instance6 >
.> ?
ToString? G
(G H
)H I
;I J
return 
( !
descriptionAttributes )
.) *
Length* 0
>1 2
$num3 4
)4 5
?6 7!
descriptionAttributes8 M
[M N
$numN O
]O P
.P Q
GetNameQ X
(X Y
)Y Z
:[ \
instance] e
.e f
ToStringf n
(n o
)o p
;p q
} 	
public 
static 
DateTime 
GetUtcDateTime -
(- .
). /
{ 	
return 
DateTime 
. 
UtcNow "
;" #
} 	
} 
}   ÷
ED:\Development\FJT\FJT-DEV\FJT.ReportViewer\Models\DownlodReportVM.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Models !
{ 
public 

class 
DownlodReportVM  
{		 
public

 
string

 
ParameterGuid

 #
{

$ %
get

& )
;

) *
set

+ .
;

. /
}

0 1
} 
} ¯
DD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Models\ErrorViewModel.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Models !
{ 
public 

class 
ErrorViewModel 
{ 
public 
int 
? 

StatusCode 
{  
get! $
;$ %
set& )
;) *
}+ ,
public		 
string		 
Message		 
{		 
get		  #
;		# $
set		% (
;		( )
}		* +
}

 
} ∑"
FD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Models\FilterParameters.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Models !
{ 
public 

class 
FilterParameters !
{		 
public

 
string

 

customerID

  
{

! "
get

# &
;

& '
set

( +
;

+ ,
}

- .
public 
int 
? 
partID 
{ 
get  
;  !
set" %
;% &
}' (
public 
int 
? 

employeeID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
supplierIDs !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 

mfgCodeIDs  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
int 
? 
assyID 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
mountingTypeIDs %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
string 
functionalTypeIDs '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
partStatusIDs #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
int 
? 
workorderID 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
? 
operationID 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
includePartTypes &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
bool 
? 
withAlternateParts '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
fromDate 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
toDate 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
fromTime 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
toTime 
{ 
get "
;" #
set$ '
;' (
}) *
public 
int 
? 
packingSlipId !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
? !
supplierPackingSlipId )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
int 
? #
packingSlipSerialNumber +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
string 
partIDs 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
assyIDs 
{ 
get  #
;# $
set% (
;( )
}* +
public   
string   
mfgType   
{   
get    #
;  # $
set  % (
;  ( )
}  * +
public!! 
string!! 
addressType!! !
{!!" #
get!!$ '
;!!' (
set!!) ,
;!!, -
}!!. /
public"" 
string"" 
isDefaultAddress"" &
{""' (
get"") ,
;"", -
set"". 1
;""1 2
}""3 4
}## 
}$$ ı
FD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Models\ReportByteDataVM.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Models !
{ 
public 

class 
ReportByteDataVM !
{		 
public

 
byte

 
[

 
]

 
ReportByteData

 $
{

% &
get

' *
;

* +
set

, /
;

/ 0
}

1 2
} 
} 
ND:\Development\FJT\FJT-DEV\FJT.ReportViewer\Models\RequestFilterParameterVM.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
Models !
{ 
public 

class $
RequestFilterParameterVM )
{		 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	deletedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public   
int   
createByRoleId   !
{  " #
get  $ '
;  ' (
set  ) ,
;  , -
}  . /
public!! 
int!! 
?!! 
updateByRoleId!! "
{!!# $
get!!% (
;!!( )
set!!* -
;!!- .
}!!/ 0
public"" 
int"" 
?"" 
deleteByRoleId"" "
{""# $
get""% (
;""( )
set""* -
;""- .
}""/ 0
public## 
string## 

reportName##  
{##! "
get### &
;##& '
set##( +
;##+ ,
}##- .
public$$ 
string$$ 
parameterValueJson$$ (
{$$) *
get$$+ .
;$$. /
set$$0 3
;$$3 4
}$$5 6
}%% 
}&& ±
JD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MongoDbModel\DynamicMessage.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MongoDbModel '
{		 
public

 

class

 
DynamicMessage

 
{ 
[ 	
BsonId	 
] 
[ 	
BsonRepresentation	 
( 
BsonType $
.$ %
ObjectId% -
)- .
]. /
public 
string 
_id 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 

messageKey  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
category 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
messageType !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
messageCode !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
createdByName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
DateTime 
createdDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
modifiedByName $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
DateTime 
modifiedDate $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
versionNumber  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
	developer 
{  !
get" %
;% &
set' *
;* +
}, -
public 
object 
previousVersion %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} “:
GD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\CompanyInfo.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
[

 
Table

 

(


 
$str

 
)

 
]

 
public 

class 
CompanyInfo 
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
name 
{ 
get  
;  !
set" %
;% &
}' (
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

personName  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
registeredEmail %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
contactCountryCode (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
contactNumber #
{$ %
get& )
;) *
set+ .
;. /
}0 1
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
faxCountryCode   $
{  % &
get  ' *
;  * +
set  , /
;  / 0
}  1 2
["" 	
StringLength""	 
("" 
$num"" 
)"" 
]"" 
public## 
string## 
	faxNumber## 
{##  !
get##" %
;##% &
set##' *
;##* +
}##, -
[%% 	
StringLength%%	 
(%% 
$num%% 
)%% 
]%% 
public&& 
string&& 
phoneExt&& 
{&&  
get&&! $
;&&$ %
set&&& )
;&&) *
}&&+ ,
[(( 	
StringLength((	 
((( 
$num(( 
)(( 
](( 
public)) 
string)) 
street1)) 
{)) 
get))  #
;))# $
set))% (
;))( )
}))* +
[++ 	
StringLength++	 
(++ 
$num++ 
)++ 
]++ 
public,, 
string,, 
street2,, 
{,, 
get,,  #
;,,# $
set,,% (
;,,( )
},,* +
[.. 	
StringLength..	 
(.. 
$num.. 
).. 
].. 
public// 
string// 
street3// 
{// 
get//  #
;//# $
set//% (
;//( )
}//* +
[11 	
StringLength11	 
(11 
$num11 
)11 
]11 
public22 
string22 
city22 
{22 
get22  
;22  !
set22" %
;22% &
}22' (
[44 	
StringLength44	 
(44 
$num44 
)44 
]44 
public55 
string55 
state55 
{55 
get55 !
;55! "
set55# &
;55& '
}55( )
[77 	
StringLength77	 
(77 
$num77 
)77 
]77 
public88 
string88 

postalCode88  
{88! "
get88# &
;88& '
set88( +
;88+ ,
}88- .
[:: 	
StringLength::	 
(:: 
$num:: 
):: 
]:: 
public;; 
string;; 
companyLogo;; !
{;;" #
get;;$ '
;;;' (
set;;) ,
;;;, -
};;. /
[== 	
StringLength==	 
(== 
$num== 
)== 
]== 
public>> 
string>> 
ein>> 
{>> 
get>> 
;>>  
set>>! $
;>>$ %
}>>& '
public@@ 
string@@ 
remittanceAddress@@ '
{@@( )
get@@* -
;@@- .
set@@/ 2
;@@2 3
}@@4 5
publicBB 
intBB 
	mfgCodeIdBB 
{BB 
getBB "
;BB" #
setBB$ '
;BB' (
}BB) *
publicDD 
intDD 
	countryIDDD 
{DD 
getDD "
;DD" #
setDD$ '
;DD' (
}DD) *
publicFF 
boolFF 
?FF 
	isDeletedFF 
{FF  
getFF! $
;FF$ %
setFF& )
;FF) *
}FF+ ,
[HH 	
StringLengthHH	 
(HH 
$numHH 
)HH 
]HH 
publicII 
stringII 
	createdByII 
{II  !
getII" %
;II% &
setII' *
;II* +
}II, -
[KK 	
StringLengthKK	 
(KK 
$numKK 
)KK 
]KK 
publicLL 
stringLL 
	updatedByLL 
{LL  !
getLL" %
;LL% &
setLL' *
;LL* +
}LL, -
[NN 	
StringLengthNN	 
(NN 
$numNN 
)NN 
]NN 
publicOO 
stringOO 
	deletedByOO 
{OO  !
getOO" %
;OO% &
setOO' *
;OO* +
}OO, -
publicQQ 
DateTimeQQ 
	createdAtQQ !
{QQ" #
getQQ$ '
;QQ' (
setQQ) ,
;QQ, -
}QQ. /
publicSS 
DateTimeSS 
	updatedAtSS !
{SS" #
getSS$ '
;SS' (
setSS) ,
;SS, -
}SS. /
publicUU 
DateTimeUU 
?UU 
	deletedAtUU "
{UU# $
getUU% (
;UU( )
setUU* -
;UU- .
}UU/ 0
publicWW 
intWW 
?WW 
createByRoleIdWW "
{WW# $
getWW% (
;WW( )
setWW* -
;WW- .
}WW/ 0
publicYY 
intYY 
?YY 
updateByRoleIdYY "
{YY# $
getYY% (
;YY( )
setYY* -
;YY- .
}YY/ 0
public[[ 
int[[ 
?[[ 
deleteByRoleId[[ "
{[[# $
get[[% (
;[[( )
set[[* -
;[[- .
}[[/ 0
[]] 	

ForeignKey]]	 
(]] 
$str]] 
)]]  
]]]  !
public^^ 
virtual^^ 

Mfgcodemst^^ !

Mfgcodemst^^" ,
{^^- .
get^^/ 2
;^^2 3
set^^4 7
;^^7 8
}^^9 :
}__ 
}`` … 
BD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\entity.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{ 
public		 

class		 
entity		 
{

 
public 
entity 
( 
) 
{ 	
reportmaster 
= 
new 
HashSet &
<& '
reportmaster' 3
>3 4
(4 5
)5 6
;6 7
} 	
[ 	
Key	 
] 
public 
int 
entityID 
{ 
get !
;! "
set# &
;& '
}( )
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

entityName  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
remark 
{ 
get "
;" #
set$ '
;' (
}) *
public 
bool 
isActive 
{ 
get "
;" #
set$ '
;' (
}) *
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
	updatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public!! 
DateTime!! 
?!! 
	deletedAt!! "
{!!# $
get!!% (
;!!( )
set!!* -
;!!- .
}!!/ 0
[## 	
StringLength##	 
(## 
$num## 
)## 
]## 
public$$ 
string$$ 
	createdBy$$ 
{$$  !
get$$" %
;$$% &
set$$' *
;$$* +
}$$, -
[&& 	
StringLength&&	 
(&& 
$num&& 
)&& 
]&& 
public'' 
string'' 
	updatedBy'' 
{''  !
get''" %
;''% &
set''' *
;''* +
}'', -
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
bool,, 
systemGenerated,, #
{,,$ %
get,,& )
;,,) *
set,,+ .
;,,. /
},,0 1
public.. 
int.. 
?.. 

columnView.. 
{..  
get..! $
;..$ %
set..& )
;..) *
}..+ ,
public00 
int00 
?00 
entityStatus00  
{00! "
get00# &
;00& '
set00( +
;00+ ,
}00- .
public22 
int22 
?22 
createByRoleId22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
public44 
int44 
?44 
updateByRoleId44 "
{44# $
get44% (
;44( )
set44* -
;44- .
}44/ 0
public66 
int66 
?66 
deleteByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
virtual88 
ICollection88 "
<88" #
reportmaster88# /
>88/ 0
reportmaster881 =
{88> ?
get88@ C
;88C D
set88E H
;88H I
}88J K
}99 
}:: • 
RD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\FixedEntityDataelement.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
[

 
Table

 

(


 
$str

 %
)

% &
]

& '
public 

class "
FixedEntityDataelement '
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportParamName %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
dbColumnName "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
displayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
isHiddenParameter %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[   	
StringLength  	 
(   
$num   
)   
]   
public!! 
string!! 
type!! 
{!! 
get!!  
;!!  !
set!!" %
;!!% &
}!!' (
public## 
int## 
?## 
dataSourceId##  
{##! "
get### &
;##& '
set##( +
;##+ ,
}##- .
public%% 
string%% 
options%% 
{%% 
get%%  #
;%%# $
set%%% (
;%%( )
}%%* +
public'' 
bool'' 
	isDeleted'' 
{'' 
get''  #
;''# $
set''% (
;''( )
}''* +
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	createdBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
[,, 	
StringLength,,	 
(,, 
$num,, 
),, 
],, 
public-- 
string-- 
	updatedBy-- 
{--  !
get--" %
;--% &
set--' *
;--* +
}--, -
[// 	
StringLength//	 
(// 
$num// 
)// 
]// 
public00 
string00 
	deletedBy00 
{00  !
get00" %
;00% &
set00' *
;00* +
}00, -
public22 
int22 
?22 
createByRoleId22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
public44 
int44 
?44 
updateByRoleId44 "
{44# $
get44% (
;44( )
set44* -
;44- .
}44/ 0
public66 
int66 
?66 
deleteByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
DateTime88 
	createdAt88 !
{88" #
get88$ '
;88' (
set88) ,
;88, -
}88. /
public:: 
DateTime:: 
?:: 
	deletedAt:: "
{::# $
get::% (
;::( )
set::* -
;::- .
}::/ 0
public<< 
DateTime<< 
?<< 
	updatedAt<< "
{<<# $
get<<% (
;<<( )
set<<* -
;<<- .
}<</ 0
}?? 
}@@ ´
KD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\FJTSqlDBContext.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{ 
public		 

class		 
FJTSqlDBContext		  
:		! "
	DbContext		# ,
{

 
public 
FJTSqlDBContext 
( 
DbContextOptions /
</ 0
FJTSqlDBContext0 ?
>? @
optionsA H
)H I
: 
base 
( 
options 
) 
{ 	
} 	
public 
virtual 
DbSet 
< 
entity #
># $
entity% +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
virtual 
DbSet 
< 
genericcategory ,
>, -
genericcategory. =
{> ?
get@ C
;C D
setE H
;H I
}J K
public 
virtual 
DbSet 
< 
reportmaster )
>) *
reportmaster+ 7
{8 9
get: =
;= >
set? B
;B C
}D E
public 
virtual 
DbSet 
< ,
 report_parameter_setting_mapping =
>= >,
 report_parameter_setting_mapping? _
{` a
getb e
;e f
setg j
;j k
}l m
public 
virtual 
DbSet 
< 
report_change_logs /
>/ 0
report_change_logs1 C
{D E
getF I
;I J
setK N
;N O
}P Q
public 
virtual 
DbSet 
< !
reportviewerparameter 2
>2 3!
reportviewerparameter4 I
{J K
getL O
;O P
setQ T
;T U
}V W
public 
virtual 
DbSet 
< !
reportmasterparameter 2
>2 3!
reportmasterparameter4 I
{J K
getL O
;O P
setQ T
;T U
}V W
public 
virtual 
DbSet 
< "
FixedEntityDataelement 3
>3 4#
FixedEntityDataelements5 L
{M N
getO R
;R S
setT W
;W X
}Y Z
public 
virtual 
DbSet 
< 
Systemconfigrations 0
>0 1
Systemconfigrations2 E
{F G
getH K
;K L
setM P
;P Q
}R S
public 
virtual 
DbSet 
< 
CompanyInfo (
>( )
CompanyInfos* 6
{7 8
get9 <
;< =
set> A
;A B
}C D
public 
virtual 
DbSet 
< 

Mfgcodemst '
>' (
Mfgcodemsts) 4
{5 6
get7 :
;: ;
set< ?
;? @
}A B
} 
} ù*
KD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\genericcategory.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{ 
public		 

class		 
genericcategory		  
{

 
public 
genericcategory 
( 
)  
{ 	
reportmaster 
= 
new 
HashSet &
<& '
reportmaster' 3
>3 4
(4 5
)5 6
;6 7
} 	
[ 	
Key	 
] 
public 
int 
gencCategoryID !
{" #
get$ '
;' (
set) ,
;, -
}. /
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
gencCategoryName &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
gencCategoryCode &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
categoryType "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
decimal 
displayOrder #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
?  
parentGencCategoryID (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
bool 
isActive 
{ 
get "
;" #
set$ '
;' (
}) *
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
	updatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
	deletedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	createdBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
[!! 	
StringLength!!	 
(!! 
$num!! 
)!! 
]!! 
public"" 
string"" 
	updatedBy"" 
{""  !
get""" %
;""% &
set""' *
;""* +
}"", -
[## 	
StringLength##	 
(## 
$num## 
)## 
]## 
public$$ 
string$$ 
	deletedBy$$ 
{$$  !
get$$" %
;$$% &
set$$' *
;$$* +
}$$, -
public%% 
bool%% 
systemGenerated%% #
{%%$ %
get%%& )
;%%) *
set%%+ .
;%%. /
}%%0 1
[&& 	
StringLength&&	 
(&& 
$num&& 
)&& 
]&& 
public'' 
string'' 
	colorCode'' 
{''  !
get''" %
;''% &
set''' *
;''* +
}'', -
public(( 
int(( 
?(( 
	termsDays(( 
{(( 
get((  #
;((# $
set((% (
;((( )
}((* +
public)) 
int)) 
?)) 
createByRoleId)) "
{))# $
get))% (
;))( )
set))* -
;))- .
}))/ 0
public** 
int** 
?** 
updateByRoleId** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
public++ 
int++ 
?++ 
deleteByRoleId++ "
{++# $
get++% (
;++( )
set++* -
;++- .
}++/ 0
public,, 
int,, 
?,, 
	carrierID,, 
{,, 
get,,  #
;,,# $
set,,% (
;,,( )
},,* +
public-- 
string-- 
description-- !
{--" #
get--$ '
;--' (
set--) ,
;--, -
}--. /
public.. 
bool.. 
?.. 
isEOM.. 
{.. 
get..  
;..  !
set.." %
;..% &
}..' (
public// 
virtual// 
ICollection// "
<//" #
reportmaster//# /
>/// 0
reportmaster//1 =
{//> ?
get//@ C
;//C D
set//E H
;//H I
}//J K
}00 
}11 •l
FD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\Mfgcodemst.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
[

 
Table

 

(


 
$str

 
)

 
]

 
public 

class 

Mfgcodemst 
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
mfgCode 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
mfgType 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
mfgName 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
? 

customerID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 
dateCodeFormatID $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
isPricingApi  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
primaryContactName   (
{  ) *
get  + .
;  . /
set  0 3
;  3 4
}  5 6
["" 	
StringLength""	 
("" 
$num"" 
)"" 
]"" 
public## 
string## 
email## 
{## 
get## !
;##! "
set### &
;##& '
}##( )
[%% 	
StringLength%%	 
(%% 
$num%% 
)%% 
]%% 
public&& 
string&& 
website&& 
{&& 
get&&  #
;&&# $
set&&% (
;&&( )
}&&* +
[(( 	
StringLength((	 
((( 
$num(( 
)(( 
](( 
public)) 
string)) 
contact)) 
{)) 
get))  #
;))# $
set))% (
;))( )
}))* +
public++ 
string++ 
comments++ 
{++  
get++! $
;++$ %
set++& )
;++) *
}+++ ,
[-- 	
StringLength--	 
(-- 
$num-- 
)-- 
]-- 
public.. 
string.. 
phExtension.. !
{.." #
get..$ '
;..' (
set..) ,
;.., -
}... /
[00 	
StringLength00	 
(00 
$num00 
)00 
]00 
public11 
string11 
contactCountryCode11 (
{11) *
get11+ .
;11. /
set110 3
;113 4
}115 6
[33 	
StringLength33	 
(33 
$num33 
)33 
]33 
public44 
string44 
	faxNumber44 
{44  !
get44" %
;44% &
set44' *
;44* +
}44, -
[66 	
StringLength66	 
(66 
$num66 
)66 
]66 
public77 
string77 
faxCountryCode77 $
{77% &
get77' *
;77* +
set77, /
;77/ 0
}771 2
public99 
bool99 
?99 
isActive99 
{99 
get99  #
;99# $
set99% (
;99( )
}99* +
public;; 
bool;; 
isCustOrDisty;; !
{;;" #
get;;$ '
;;;' (
set;;) ,
;;;, -
};;. /
public== 
int== 
?== 
custTermsID== 
{==  !
get==" %
;==% &
set==' *
;==* +
}==, -
public?? 
string?? 
acquisitionDetail?? '
{??( )
get??* -
;??- .
set??/ 2
;??2 3
}??4 5
publicAA 
intAA 
?AA 
paymentTermsIDAA "
{AA# $
getAA% (
;AA( )
setAA* -
;AA- .
}AA/ 0
[CC 	
StringLengthCC	 
(CC 
$numCC 
)CC 
]CC 
publicDD 
stringDD 
	territoryDD 
{DD  !
getDD" %
;DD% &
setDD' *
;DD* +
}DD, -
publicFF 
intFF 
?FF 
shippingMethodIDFF $
{FF% &
getFF' *
;FF* +
setFF, /
;FF/ 0
}FF1 2
publicHH 
boolHH 
?HH 
	isCompanyHH 
{HH  
getHH! $
;HH$ %
setHH& )
;HH) *
}HH+ ,
[JJ 	
StringLengthJJ	 
(JJ 
$numJJ 
)JJ 
]JJ 
publicKK 
stringKK 
scanDocumentSideKK &
{KK' (
getKK) ,
;KK, -
setKK. 1
;KK1 2
}KK3 4
publicMM 
intMM 
?MM 
authorizeTypeMM !
{MM" #
getMM$ '
;MM' (
setMM) ,
;MM, -
}MM. /
publicOO 
boolOO 
?OO 
systemGeneratedOO $
{OO% &
getOO' *
;OO* +
setOO, /
;OO/ 0
}OO1 2
publicQQ 
boolQQ 
?QQ +
isOrderQtyRequiredInPackingSlipQQ 4
{QQ5 6
getQQ7 :
;QQ: ;
setQQ< ?
;QQ? @
}QQA B
[SS 	
StringLengthSS	 
(SS 
$numSS 
)SS 
]SS 
publicTT 
stringTT 
customerTypeTT "
{TT# $
getTT% (
;TT( )
setTT* -
;TT- .
}TT/ 0
publicVV 
decimalVV 
?VV 
displayOrderVV $
{VV% &
getVV' *
;VV* +
setVV, /
;VV/ 0
}VV1 2
publicXX 
intXX 
?XX 
salesCommissionToXX %
{XX& '
getXX( +
;XX+ ,
setXX- 0
;XX0 1
}XX2 3
publicZZ 
intZZ 
?ZZ 
freeOnBoardIdZZ !
{ZZ" #
getZZ$ '
;ZZ' (
setZZ) ,
;ZZ, -
}ZZ. /
[\\ 	
StringLength\\	 
(\\ 
$num\\ 
)\\ 
]\\ 
public]] 
string]] "
supplierMFRMappingType]] ,
{]]- .
get]]/ 2
;]]2 3
set]]4 7
;]]7 8
}]]9 :
[__ 	
StringLength__	 
(__ 
$num__ 
)__ 
]__ 
public`` 
string`` 
taxID`` 
{`` 
get`` !
;``! "
set``# &
;``& '
}``( )
[bb 	
StringLengthbb	 
(bb 
$numbb 
)bb 
]bb 
publiccc 
stringcc 

accountRefcc  
{cc! "
getcc# &
;cc& '
setcc( +
;cc+ ,
}cc- .
publicee 
intee 
?ee 
paymentMethodIDee #
{ee$ %
getee& )
;ee) *
setee+ .
;ee. /
}ee0 1
publicgg 
intgg 
?gg 
bankIDgg 
{gg 
getgg  
;gg  !
setgg" %
;gg% &
}gg' (
publicii 
intii 
?ii 
	carrierIDii 
{ii 
getii  #
;ii# $
setii% (
;ii( )
}ii* +
publickk 
intkk 
?kk 
rmaCarrierIDkk  
{kk! "
getkk# &
;kk& '
setkk( +
;kk+ ,
}kk- .
publicmm 
intmm 
?mm 
rmashippingMethodIdmm '
{mm( )
getmm* -
;mm- .
setmm/ 2
;mm2 3
}mm4 5
[oo 	
StringLengthoo	 
(oo 
$numoo 
)oo 
]oo 
publicpp 
stringpp 
carrierAccountpp $
{pp% &
getpp' *
;pp* +
setpp, /
;pp/ 0
}pp1 2
[rr 	
StringLengthrr	 
(rr 
$numrr 
)rr 
]rr 
publicss 
stringss 
rmaCarrierAccountss '
{ss( )
getss* -
;ss- .
setss/ 2
;ss2 3
}ss4 5
publicuu 
Int16uu 
shippingInsurenceuu &
{uu' (
getuu) ,
;uu, -
setuu. 1
;uu1 2
}uu3 4
publicww 
Int16ww  
rmaShippingInsurenceww )
{ww* +
getww, /
;ww/ 0
setww1 4
;ww4 5
}ww6 7
publicyy 
stringyy 
	poCommentyy 
{yy  !
getyy" %
;yy% &
setyy' *
;yy* +
}yy, -
[{{ 	
StringLength{{	 
({{ 
$num{{ 
){{ 
]{{ 
public|| 
string|| 
documentPath|| "
{||# $
get||% (
;||( )
set||* -
;||- .
}||/ 0
[~~ 	
StringLength~~	 
(~~ 
$num~~ 
)~~ 
]~~ 
public 
string 
systemID 
{  
get! $
;$ %
set& )
;) *
}+ ,
[
ÅÅ 	
StringLength
ÅÅ	 
(
ÅÅ 
$num
ÅÅ 
)
ÅÅ 
]
ÅÅ 
public
ÇÇ 
string
ÇÇ 
customerSystemID
ÇÇ &
{
ÇÇ' (
get
ÇÇ) ,
;
ÇÇ, -
set
ÇÇ. 1
;
ÇÇ1 2
}
ÇÇ3 4
public
ÑÑ 
bool
ÑÑ 
?
ÑÑ /
!invoicesRequireManagementApproval
ÑÑ 6
{
ÑÑ7 8
get
ÑÑ9 <
;
ÑÑ< =
set
ÑÑ> A
;
ÑÑA B
}
ÑÑC D
public
ÜÜ 
int
ÜÜ 
?
ÜÜ 
acctId
ÜÜ 
{
ÜÜ 
get
ÜÜ  
;
ÜÜ  !
set
ÜÜ" %
;
ÜÜ% &
}
ÜÜ' (
public
àà 
DateTime
àà 
unqDate
àà 
{
àà  !
get
àà" %
;
àà% &
set
àà' *
;
àà* +
}
àà, -
public
ää 
bool
ää 
isSupplierEnable
ää $
{
ää% &
get
ää' *
;
ää* +
set
ää, /
;
ää/ 0
}
ää1 2
public
åå 
decimal
åå 
?
åå #
externalSupplierOrder
åå -
{
åå. /
get
åå0 3
;
åå3 4
set
åå5 8
;
åå8 9
}
åå: ;
public
éé 
bool
éé 
?
éé 
	isDeleted
éé 
{
éé  
get
éé! $
;
éé$ %
set
éé& )
;
éé) *
}
éé+ ,
[
êê 	
StringLength
êê	 
(
êê 
$num
êê 
)
êê 
]
êê 
public
ëë 
string
ëë 
	createdBy
ëë 
{
ëë  !
get
ëë" %
;
ëë% &
set
ëë' *
;
ëë* +
}
ëë, -
[
ìì 	
StringLength
ìì	 
(
ìì 
$num
ìì 
)
ìì 
]
ìì 
public
îî 
string
îî 
	updatedBy
îî 
{
îî  !
get
îî" %
;
îî% &
set
îî' *
;
îî* +
}
îî, -
[
ññ 	
StringLength
ññ	 
(
ññ 
$num
ññ 
)
ññ 
]
ññ 
public
óó 
string
óó 
	deletedBy
óó 
{
óó  !
get
óó" %
;
óó% &
set
óó' *
;
óó* +
}
óó, -
public
ôô 
DateTime
ôô 
	createdAt
ôô !
{
ôô" #
get
ôô$ '
;
ôô' (
set
ôô) ,
;
ôô, -
}
ôô. /
public
õõ 
DateTime
õõ 
?
õõ 
	updatedAt
õõ "
{
õõ# $
get
õõ% (
;
õõ( )
set
õõ* -
;
õõ- .
}
õõ/ 0
public
ùù 
DateTime
ùù 
?
ùù 
	deletedAt
ùù "
{
ùù# $
get
ùù% (
;
ùù( )
set
ùù* -
;
ùù- .
}
ùù/ 0
public
üü 
int
üü 
?
üü 
createByRoleId
üü "
{
üü# $
get
üü% (
;
üü( )
set
üü* -
;
üü- .
}
üü/ 0
public
°° 
int
°° 
?
°° 
updateByRoleId
°° "
{
°°# $
get
°°% (
;
°°( )
set
°°* -
;
°°- .
}
°°/ 0
public
££ 
int
££ 
?
££ 
deleteByRoleId
££ "
{
££# $
get
££% (
;
££( )
set
££* -
;
££- .
}
££/ 0
}
§§ 
}•• ˚e
HD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\reportmaster.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
public

 

class

 
reportmaster

 
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
rdlcReportFileName (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportTitle !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
? 

customerID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public   
int   
?   
partID   
{   
get    
;    !
set  " %
;  % &
}  ' (
public"" 
int"" 
?"" 
	companyID"" 
{"" 
get""  #
;""# $
set""% (
;""( )
}""* +
public$$ 
int$$ 
?$$ 
fromDate$$ 
{$$ 
get$$ "
;$$" #
set$$$ '
;$$' (
}$$) *
public&& 
int&& 
?&& 
toDate&& 
{&& 
get&&  
;&&  !
set&&" %
;&&% &
}&&' (
public(( 
string(( 
logicalExpression(( '
{((( )
get((* -
;((- .
set((/ 2
;((2 3
}((4 5
public** 
bool** 
	isDeleted** 
{** 
get**  #
;**# $
set**% (
;**( )
}*** +
public,, 
DateTime,, 
	createdAt,, !
{,," #
get,,$ '
;,,' (
set,,) ,
;,,, -
},,. /
[.. 	
StringLength..	 
(.. 
$num.. 
).. 
].. 
public// 
string// 
	createdBy// 
{//  !
get//" %
;//% &
set//' *
;//* +
}//, -
public11 
DateTime11 
?11 
	updatedAt11 "
{11# $
get11% (
;11( )
set11* -
;11- .
}11/ 0
[33 	
StringLength33	 
(33 
$num33 
)33 
]33 
public44 
string44 
	updatedBy44 
{44  !
get44" %
;44% &
set44' *
;44* +
}44, -
public66 
DateTime66 
?66 
	deletedAt66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
[88 	
StringLength88	 
(88 
$num88 
)88 
]88 
public99 
string99 
	deletedBy99 
{99  !
get99" %
;99% &
set99' *
;99* +
}99, -
public;; 
int;; 
?;; 
withAlternateParts;; &
{;;' (
get;;) ,
;;;, -
set;;. 1
;;;1 2
};;3 4
public== 
int== 
?== 
customerSelectType== &
{==' (
get==) ,
;==, -
set==. 1
;==1 2
}==3 4
public?? 
int?? 
??? 
partSelectType?? "
{??# $
get??% (
;??( )
set??* -
;??- .
}??/ 0
publicAA 
intAA 
?AA 

employeeIDAA 
{AA  
getAA! $
;AA$ %
setAA& )
;AA) *
}AA+ ,
publicCC 
intCC 
?CC 
employeeSelectTypeCC &
{CC' (
getCC) ,
;CC, -
setCC. 1
;CC1 2
}CC3 4
publicEE 
intEE 
?EE 

supplierIDEE 
{EE  
getEE! $
;EE$ %
setEE& )
;EE) *
}EE+ ,
publicGG 
intGG 
?GG 
supplierSelectTypeGG &
{GG' (
getGG) ,
;GG, -
setGG. 1
;GG1 2
}GG3 4
publicII 
intII 
?II 
	mfgCodeIDII 
{II 
getII  #
;II# $
setII% (
;II( )
}II* +
publicKK 
intKK 
?KK 
mfgCodeSelectTypeKK %
{KK& '
getKK( +
;KK+ ,
setKK- 0
;KK0 1
}KK2 3
publicMM 
intMM 
?MM 
assyIDMM 
{MM 
getMM  
;MM  !
setMM" %
;MM% &
}MM' (
publicOO 
intOO 
?OO 
assySelectTypeOO "
{OO# $
getOO% (
;OO( )
setOO* -
;OO- .
}OO/ 0
publicQQ 
intQQ 
?QQ 
mountingTypeIDQQ "
{QQ# $
getQQ% (
;QQ( )
setQQ* -
;QQ- .
}QQ/ 0
publicSS 
intSS 
?SS "
mountingTypeSelectTypeSS *
{SS+ ,
getSS- 0
;SS0 1
setSS2 5
;SS5 6
}SS7 8
publicUU 
intUU 
?UU 
functionalTypeIDUU $
{UU% &
getUU' *
;UU* +
setUU, /
;UU/ 0
}UU1 2
publicWW 
intWW 
?WW $
functionalTypeSelectTypeWW ,
{WW- .
getWW/ 2
;WW2 3
setWW4 7
;WW7 8
}WW9 :
publicYY 
intYY 
?YY 
partStatusIDYY  
{YY! "
getYY# &
;YY& '
setYY( +
;YY+ ,
}YY- .
public[[ 
int[[ 
?[[  
partStatusSelectType[[ (
{[[) *
get[[+ .
;[[. /
set[[0 3
;[[3 4
}[[5 6
public]] 
int]] 
?]] 
workorderID]] 
{]]  !
get]]" %
;]]% &
set]]' *
;]]* +
}]], -
public__ 
int__ 
?__ 
workorderSelectType__ '
{__( )
get__* -
;__- .
set__/ 2
;__2 3
}__4 5
publicaa 
intaa 
?aa 
operationIDaa 
{aa  !
getaa" %
;aa% &
setaa' *
;aa* +
}aa, -
publiccc 
intcc 
?cc 
operationSelectTypecc '
{cc( )
getcc* -
;cc- .
setcc/ 2
;cc2 3
}cc4 5
publicee 
intee 
?ee 
reportCategoryIdee $
{ee% &
getee' *
;ee* +
setee, /
;ee/ 0
}ee1 2
publicgg 
boolgg 
?gg 
reportViewTypegg #
{gg$ %
getgg& )
;gg) *
setgg+ .
;gg. /
}gg0 1
[ii 	
StringLengthii	 
(ii 
$numii 
)ii 
]ii 
publicjj 
stringjj 
	reportAPIjj 
{jj  !
getjj" %
;jj% &
setjj' *
;jj* +
}jj, -
publicll 
boolll 
?ll 
isExcelll 
{ll 
getll "
;ll" #
setll$ '
;ll' (
}ll) *
publicnn 
intnn 
?nn 
createByRoleIdnn "
{nn# $
getnn% (
;nn( )
setnn* -
;nn- .
}nn/ 0
publicpp 
intpp 
?pp 
updateByRoleIdpp "
{pp# $
getpp% (
;pp( )
setpp* -
;pp- .
}pp/ 0
publicrr 
intrr 
?rr 
deleteByRoleIdrr "
{rr# $
getrr% (
;rr( )
setrr* -
;rr- .
}rr/ 0
publictt 
inttt 
?tt 
emailTempletett !
{tt" #
gettt$ '
;tt' (
settt) ,
;tt, -
}tt. /
publicvv 
intvv 
?vv 
fromTimevv 
{vv 
getvv "
;vv" #
setvv$ '
;vv' (
}vv) *
publicxx 
intxx 
?xx 
toTimexx 
{xx 
getxx  
;xx  !
setxx" %
;xx% &
}xx' (
[zz 	
StringLengthzz	 
(zz 
$numzz 
)zz 
]zz 
public{{ 
string{{ 
fileName{{ 
{{{  
get{{! $
;{{$ %
set{{& )
;{{) *
}{{+ ,
public}} 
bool}} 
?}} 
isEndUserReport}} $
{}}% &
get}}' *
;}}* +
set}}, /
;}}/ 0
}}}1 2
[ 	
StringLength	 
( 
$num 
) 
] 
public
ÄÄ 
string
ÄÄ 
draftFileName
ÄÄ #
{
ÄÄ$ %
get
ÄÄ& )
;
ÄÄ) *
set
ÄÄ+ .
;
ÄÄ. /
}
ÄÄ0 1
public
ÇÇ 
int
ÇÇ 
?
ÇÇ 
radioButtonFilter
ÇÇ %
{
ÇÇ& '
get
ÇÇ( +
;
ÇÇ+ ,
set
ÇÇ- 0
;
ÇÇ0 1
}
ÇÇ2 3
public
ÑÑ 
string
ÑÑ 
additionalNotes
ÑÑ %
{
ÑÑ& '
get
ÑÑ( +
;
ÑÑ+ ,
set
ÑÑ- 0
;
ÑÑ0 1
}
ÑÑ2 3
public
ÜÜ 
bool
ÜÜ 
isCSVReport
ÜÜ 
{
ÜÜ  !
get
ÜÜ" %
;
ÜÜ% &
set
ÜÜ' *
;
ÜÜ* +
}
ÜÜ, -
public
àà 
string
àà 
csvReportAPI
àà "
{
àà# $
get
àà% (
;
àà( )
set
àà* -
;
àà- .
}
àà/ 0
public
ää 
int
ää 
?
ää 
refReportId
ää 
{
ää  !
get
ää" %
;
ää% &
set
ää' *
;
ää* +
}
ää, -
[
åå 	
StringLength
åå	 
(
åå 
$num
åå 
)
åå 
]
åå 
public
çç 
string
çç 
status
çç 
{
çç 
get
çç "
;
çç" #
set
çç$ '
;
çç' (
}
çç) *
public
èè 
int
èè 
?
èè 
entityId
èè 
{
èè 
get
èè "
;
èè" #
set
èè$ '
;
èè' (
}
èè) *
public
ëë 
int
ëë 
?
ëë 
	editingBy
ëë 
{
ëë 
get
ëë  #
;
ëë# $
set
ëë% (
;
ëë( )
}
ëë* +
public
ìì 
DateTime
ìì 
?
ìì  
startDesigningDate
ìì +
{
ìì, -
get
ìì. 1
;
ìì1 2
set
ìì3 6
;
ìì6 7
}
ìì8 9
public
ïï 
string
ïï "
reportGenerationType
ïï *
{
ïï+ ,
get
ïï- 0
;
ïï0 1
set
ïï2 5
;
ïï5 6
}
ïï7 8
[
óó 	
StringLength
óó	 
(
óó 
$num
óó 
)
óó 
]
óó 
public
òò 
string
òò 
reportVersion
òò #
{
òò$ %
get
òò& )
;
òò) *
set
òò+ .
;
òò. /
}
òò0 1
public
öö 
bool
öö 
isDefaultReport
öö #
{
öö$ %
get
öö& )
;
öö) *
set
öö+ .
;
öö. /
}
öö0 1
[
úú 	

ForeignKey
úú	 
(
úú 
$str
úú 
)
úú 
]
úú  
public
ùù 
virtual
ùù 
entity
ùù 
entity
ùù $
{
ùù% &
get
ùù' *
;
ùù* +
set
ùù, /
;
ùù/ 0
}
ùù1 2
[
üü 	

ForeignKey
üü	 
(
üü 
$str
üü &
)
üü& '
]
üü' (
public
†† 
virtual
†† 
genericcategory
†† &
genericcategory
††' 6
{
††7 8
get
††9 <
;
††< =
set
††> A
;
††A B
}
††C D
}
§§ 
}•• 
QD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\reportmasterparameter.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
public

 

class

 !
reportmasterparameter

 &
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
int 
reportId 
{ 
get !
;! "
set# &
;& '
}( )
public 
int 
parmeterMappingid $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 

isRequired 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	deletedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public   
DateTime   
	createdAt   !
{  " #
get  $ '
;  ' (
set  ) ,
;  , -
}  . /
public"" 
DateTime"" 
?"" 
	updatedAt"" "
{""# $
get""% (
;""( )
set""* -
;""- .
}""/ 0
public$$ 
DateTime$$ 
?$$ 
	deletedAt$$ "
{$$# $
get$$% (
;$$( )
set$$* -
;$$- .
}$$/ 0
public&& 
int&& 
createByRoleId&& !
{&&" #
get&&$ '
;&&' (
set&&) ,
;&&, -
}&&. /
public(( 
int(( 
?(( 
updateByRoleId(( "
{((# $
get((% (
;((( )
set((* -
;((- .
}((/ 0
public** 
int** 
?** 
deleteByRoleId** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
[,, 	

ForeignKey,,	 
(,, 
$str,, 
),, 
],,  
public-- 
virtual-- 
reportmaster-- #
reportmaster--$ 0
{--1 2
get--3 6
;--6 7
set--8 ;
;--; <
}--= >
[// 	

ForeignKey//	 
(// 
$str// '
)//' (
]//( )
public00 
virtual00 ,
 report_parameter_setting_mapping00 7,
 Report_Parameter_Setting_Mapping008 X
{00Y Z
get00[ ^
;00^ _
set00` c
;00c d
}00e f
}11 
}22 û
QD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\reportviewerparameter.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
public

 

class

 !
reportviewerparameter

 &
{ 
[ 	
Key	 
] 
public 
Guid 
parameterGUID !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
reportId 
{ 
get !
;! "
set# &
;& '
}( )
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
parameterValues %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	deletedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public!! 
DateTime!! 
	createdAt!! !
{!!" #
get!!$ '
;!!' (
set!!) ,
;!!, -
}!!. /
public## 
DateTime## 
?## 
	updatedAt## "
{### $
get##% (
;##( )
set##* -
;##- .
}##/ 0
public%% 
DateTime%% 
?%% 
	deletedAt%% "
{%%# $
get%%% (
;%%( )
set%%* -
;%%- .
}%%/ 0
public'' 
int'' 
createByRoleId'' !
{''" #
get''$ '
;''' (
set'') ,
;'', -
}''. /
public)) 
int)) 
?)) 
updateByRoleId)) "
{))# $
get))% (
;))( )
set))* -
;))- .
}))/ 0
public++ 
int++ 
?++ 
deleteByRoleId++ "
{++# $
get++% (
;++( )
set++* -
;++- .
}++/ 0
[-- 	

ForeignKey--	 
(-- 
$str-- 
)-- 
]--  
public.. 
virtual.. 
reportmaster.. #
reportmaster..$ 0
{..1 2
get..3 6
;..6 7
set..8 ;
;..; <
}..= >
}// 
}00 Ì
ND:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\report_change_logs.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
public

 

class

 
report_change_logs

 #
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
int 
reportId 
{ 
get !
;! "
set# &
;& '
}( )
public 
DateTime 
startActivityDate )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
DateTime 
? 
endActivityDate (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
int 
activityStartBy "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	deletedBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
public$$ 
DateTime$$ 
?$$ 
	updatedAt$$ "
{$$# $
get$$% (
;$$( )
set$$* -
;$$- .
}$$/ 0
public&& 
DateTime&& 
?&& 
	deletedAt&& "
{&&# $
get&&% (
;&&( )
set&&* -
;&&- .
}&&/ 0
public(( 
int(( 
?(( 
createByRoleId(( "
{((# $
get((% (
;((( )
set((* -
;((- .
}((/ 0
public** 
int** 
?** 
updateByRoleId** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
public,, 
int,, 
?,, 
deleteByRoleId,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
[.. 	

ForeignKey..	 
(.. 
$str.. 
).. 
]..  
public// 
virtual// 
reportmaster// #
reportmaster//$ 0
{//1 2
get//3 6
;//6 7
set//8 ;
;//; <
}//= >
}00 
}11 ”&
\D:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\report_parameter_setting_mapping.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
public

 

class

 ,
 report_parameter_setting_mapping

 1
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportParamName %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
dbColumnName "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
displayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
pageRouteState $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
isHiddenParameter %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
type 
{ 
get  
;  !
set" %
;% &
}' (
public   
int   
?   
dataSourceId    
{  ! "
get  # &
;  & '
set  ( +
;  + ,
}  - .
public"" 
string"" 
options"" 
{"" 
get""  #
;""# $
set""% (
;""( )
}""* +
public$$ 
bool$$ 
	isDisplay$$ 
{$$ 
get$$  #
;$$# $
set$$% (
;$$( )
}$$* +
public&& 
decimal&& 
displayOrder&& #
{&&$ %
get&&& )
;&&) *
set&&+ .
;&&. /
}&&0 1
public(( 
bool(( 
	isDeleted(( 
{(( 
get((  #
;((# $
set((% (
;((( )
}((* +
[** 	
StringLength**	 
(** 
$num** 
)** 
]** 
public++ 
string++ 
	createdBy++ 
{++  !
get++" %
;++% &
set++' *
;++* +
}++, -
[-- 	
StringLength--	 
(-- 
$num-- 
)-- 
]-- 
public.. 
string.. 
	updatedBy.. 
{..  !
get.." %
;..% &
set..' *
;..* +
}.., -
[00 	
StringLength00	 
(00 
$num00 
)00 
]00 
public11 
string11 
	deletedBy11 
{11  !
get11" %
;11% &
set11' *
;11* +
}11, -
public33 
int33 
?33 
createByRoleId33 "
{33# $
get33% (
;33( )
set33* -
;33- .
}33/ 0
public55 
int55 
?55 
updateByRoleId55 "
{55# $
get55% (
;55( )
set55* -
;55- .
}55/ 0
public77 
int77 
?77 
deleteByRoleId77 "
{77# $
get77% (
;77( )
set77* -
;77- .
}77/ 0
public99 
DateTime99 
	createdAt99 !
{99" #
get99$ '
;99' (
set99) ,
;99, -
}99. /
public;; 
DateTime;; 
?;; 
	deletedAt;; "
{;;# $
get;;% (
;;;( )
set;;* -
;;;- .
};;/ 0
public== 
DateTime== 
?== 
	updatedAt== "
{==# $
get==% (
;==( )
set==* -
;==- .
}==/ 0
[?? 	

ForeignKey??	 
(?? 
$str?? "
)??" #
]??# $
public@@ 
virtual@@ "
FixedEntityDataelement@@ -"
FixedEntityDataelement@@. D
{@@E F
get@@G J
;@@J K
set@@L O
;@@O P
}@@Q R
}AA 
}BB ¢"
OD:\Development\FJT\FJT-DEV\FJT.ReportViewer\MySqlDBModel\Systemconfigrations.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 
MySqlDBModel '
{		 
[

 
Table

 

(


 
$str

  
)

  !
]

! "
public 

class 
Systemconfigrations $
{ 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
key 
{ 
get 
;  
set! $
;$ %
}& '
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
values 
{ 
get "
;" #
set$ '
;' (
}) *
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
clusterName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
? 
isEncrypted  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
bool 
? 
isActive 
{ 
get  #
;# $
set% (
;( )
}* +
public 
bool 
? 
	isDeleted 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	createdBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
[$$ 	
StringLength$$	 
($$ 
$num$$ 
)$$ 
]$$ 
public%% 
string%% 
	updatedBy%% 
{%%  !
get%%" %
;%%% &
set%%' *
;%%* +
}%%, -
public'' 
DateTime'' 
	updatedAt'' !
{''" #
get''$ '
;''' (
set'') ,
;'', -
}''. /
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
DateTime,, 
?,, 
	deletedAt,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
public.. 
bool.. 

isEditable.. 
{..  
get..! $
;..$ %
set..& )
;..) *
}..+ ,
[00 	
StringLength00	 
(00 
$num00 
)00 
]00 
public11 
string11 
description11 !
{11" #
get11$ '
;11' (
set11) ,
;11, -
}11. /
[33 	
StringLength33	 
(33 
$num33 
)33 
]33 
public44 
string44 
displayName44 !
{44" #
get44$ '
;44' (
set44) ,
;44, -
}44. /
public66 
int66 
?66 
createByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
int88 
?88 
updateByRoleId88 "
{88# $
get88% (
;88( )
set88* -
;88- .
}88/ 0
public:: 
int:: 
?:: 
deleteByRoleId:: "
{::# $
get::% (
;::( )
set::* -
;::- .
}::/ 0
};; 
}<< ‘
6D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Program.cs
	namespace 	
FJT
 
. 
ReportViewer 
{ 
public 

class 
Program 
{ 
public 
static 
void 
Main 
(  
string  &
[& '
]' (
args) -
)- .
{ 	
var 
config 
= 
new  
ConfigurationBuilder 1
(1 2
)2 3
. 
AddJsonFile 
( 
$str /
)/ 0
. 
Build 
( 
) 
; 
Log 
. 
Logger 
= 
new 
LoggerConfiguration 0
(0 1
)1 2
. 
ReadFrom 
. 
Configuration *
(* +
config+ 1
)1 2
. 
CreateLogger  
(  !
)! "
;" #
try 
{ 
Log 
. 
Information 
(  
$str  7
)7 8
;8 9
CreateHostBuilder !
(! "
args" &
)& '
.' (
Build( -
(- .
). /
./ 0
Run0 3
(3 4
)4 5
;5 6
} 
catch 
( 
	Exception 
ex 
)  
{ 
Log   
.   
Fatal   
(   
ex   
,   
$str   ;
)  ; <
;  < =
}!! 
finally"" 
{## 
Log$$ 
.$$ 
CloseAndFlush$$ !
($$! "
)$$" #
;$$# $
}%% 
}&& 	
public(( 
static(( 
IHostBuilder(( "
CreateHostBuilder((# 4
(((4 5
string((5 ;
[((; <
]((< =
args((> B
)((B C
=>((D F
Host)) 
.))  
CreateDefaultBuilder)) %
())% &
args))& *
)))* +
.** 

UseSerilog** 
(** 
)** 
.++ $
ConfigureWebHostDefaults++ )
(++) *

webBuilder++* 4
=>++5 7
{,, 

webBuilder-- 
.-- 

UseStartup-- )
<--) *
Startup--* 1
>--1 2
(--2 3
)--3 4
;--4 5
}.. 
).. 
;.. 
}// 
}00 ”
OD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Repository\DynamicMessageService.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 

Repository %
{ 
public 

class !
DynamicMessageService &
:' ("
IDynamicMessageService) ?
{ 
private 
readonly 
IMongoCollection )
<) *
DynamicMessage* 8
>8 9
_dynamicMessages: J
;J K
private 
readonly 
MongoCollections )
_mongoCollections* ;
;; <
private 
readonly 
IMongoDBContext (
_mongoDBContext) 8
;8 9
public !
DynamicMessageService $
($ %
IOptions% -
<- .
MongoDBConfig. ;
>; <
mongoDBConfig= J
,J K
IMongoDBContextL [
mongoDBContext\ j
)j k
{ 	
_mongoDBContext 
= 
mongoDBContext ,
;, -
_mongoCollections 
= 
mongoDBConfig  -
.- .
Value. 3
.3 4
MongoCollections4 D
;D E
var 
	dbContext 
= 
_mongoDBContext +
.+ ,
GetDBContext, 8
(8 9
)9 :
;: ;
_dynamicMessages 
= 
	dbContext (
.( )
GetCollection) 6
<6 7
DynamicMessage7 E
>E F
(F G
_mongoCollectionsG X
.X Y(
DynamicMessageCollectionNameY u
)u v
;v w
} 	
public   
async   
Task   
<   
DynamicMessage   (
>  ( )
Get  * -
(  - .
string  . 4

messageKey  5 ?
)  ? @
=>  A C
await!! 
_dynamicMessages!! "
.!!" #
Find!!# '
(!!' (
x!!( )
=>!!* ,
x!!- .
.!!. /

messageKey!!/ 9
==!!: <

messageKey!!= G
&&!!H J
x!!K L
.!!L M
	isDeleted!!M V
==!!W Y
false!!Z _
)!!_ `
.!!` a
FirstOrDefaultAsync!!a t
(!!t u
)!!u v
??!!w y
new!!z }
DynamicMessage	!!~ å
{
!!ç é
messageType
!!è ö
=
!!õ ú
$str
!!ù §
,
!!§ •
message
!!¶ ≠
=
!!Æ Ø
ConstantHelper
!!∞ æ
.
!!æ ø&
MONGODB_CONNECTION_ERROR
!!ø ◊
}
!!ÿ Ÿ
;
!!Ÿ ⁄
}"" 
}## à0
QD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Repository\HttpsResponseRepository.cs
	namespace

 	
FJT


 
.

 
ReportViewer

 
.

 

Repository

 %
{ 
public 

class #
HttpsResponseRepository (
:) *$
IHttpsResponseRepository+ C
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
public #
HttpsResponseRepository &
(& '"
IDynamicMessageService' =!
dynamicMessageService> S
)S T
{ 	"
_dynamicMessageService "
=# $!
dynamicMessageService% :
;: ;
} 	
public 
OkObjectResult 
ReturnResult *
(* +
APIStatusCode+ 8
apiStatusCode9 F
,F G
APIStateH P
apiStateQ Y
,Y Z
object[ a
Datab f
,f g
UserMessageh s
userMessaget 
)	 Ä
{ 	
ApiResponse 
response  
=! "
new# &
ApiResponse' 2
(2 3
)3 4
{ 
apiStatusCode 
= 
apiStatusCode  -
,- .
status 
= 
apiState !
.! "
GetDisplayValue" 1
(1 2
)2 3
,3 4
data 
= 
Data 
, 
userMessage 
= 
userMessage )
} 
; 
return 
new 
OkObjectResult %
(% &
response& .
). /
;/ 0
} 	
public   
async   
Task   
<   
OkObjectResult   (
>  ( )#
ReturnExceptionResponse  * A
(  A B
	Exception  B K
e  L M
)  M N
{!! 	
var"" 
somethingWrongMSG"" !
=""" #
await""$ )"
_dynamicMessageService""* @
.""@ A
Get""A D
(""D E
SOMTHING_WRONG""E S
)""S T
;""T U
ApiResponse## 
response##  
=##! "
new### &
ApiResponse##' 2
(##2 3
)##3 4
{$$ 
apiStatusCode%% 
=%% 
APIStatusCode%%  -
.%%- .
ERROR%%. 3
,%%3 4
status&& 
=&& 
APIState&& !
.&&! "
FAILED&&" (
.&&( )
GetDisplayValue&&) 8
(&&8 9
)&&9 :
,&&: ;
userMessage'' 
='' 
new'' !
UserMessage''" -
{''. /
messageContent''0 >
=''? @
new''A D
MessageContent''E S
{''T U
messageType''V a
=''b c
somethingWrongMSG''d u
.''u v
messageType	''v Å
,
''Å Ç
messageCode
''É é
=
''è ê
somethingWrongMSG
''ë ¢
.
''¢ £
messageCode
''£ Æ
,
''Æ Ø
message
''∞ ∑
=
''∏ π
somethingWrongMSG
''∫ À
.
''À Ã
message
''Ã ”
,
''” ‘
err
''’ ÿ
=
''Ÿ ⁄
new
''€ ﬁ
ErrorVM
''ﬂ Ê
{
''Á Ë
message
''È 
=
''Ò Ú
e
''Û Ù
.
''Ù ı
Message
''ı ¸
,
''¸ ˝
stack
''˛ É
=
''Ñ Ö
e
''Ü á
.
''á à

StackTrace
''à í
}
''ì î
}
''ï ñ
}
''ó ò
}(( 
;(( 
return)) 
new)) 
OkObjectResult)) %
())% &
response))& .
))). /
;))/ 0
}** 	
}++ 
public-- 

class-- 
ApiResponse-- 
{.. 
public// 
APIStatusCode// 
apiStatusCode// *
{//+ ,
get//- 0
;//0 1
set//2 5
;//5 6
}//7 8
public00 
string00 
status00 
{00 
get00 "
;00" #
set00$ '
;00' (
}00) *
public11 
UserMessage11 
userMessage11 &
{11' (
get11) ,
;11, -
set11. 1
;111 2
}113 4
public22 
object22 
data22 
{22 
get22  
;22  !
set22" %
;22% &
}22' (
}33 
public55 

class55 
UserMessage55 
{66 
public77 
string77 
message77 
{77 
get77  #
;77# $
set77% (
;77( )
}77* +
public88 
MessageContent88 
messageContent88 ,
{88- .
get88/ 2
;882 3
set884 7
;887 8
}889 :
}99 
public;; 

class;; 
MessageContent;; 
{<< 
public== 
string== 
message== 
{== 
get==  #
;==# $
set==% (
;==( )
}==* +
public>> 
string>> 
messageCode>> !
{>>" #
get>>$ '
;>>' (
set>>) ,
;>>, -
}>>. /
public?? 
string?? 
messageType?? !
{??" #
get??$ '
;??' (
set??) ,
;??, -
}??. /
public@@ 
ErrorVM@@ 
err@@ 
{@@ 
get@@  
;@@  !
set@@" %
;@@% &
}@@' (
}AA 
publicCC 

classCC 
ErrorVMCC 
{DD 
publicEE 
stringEE 
messageEE 
{EE 
getEE  #
;EE# $
setEE% (
;EE( )
}EE* +
publicFF 
stringFF 
stackFF 
{FF 
getFF !
;FF! "
setFF# &
;FF& '
}FF( )
}GG 
}HH …
ZD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Repository\Interface\IDynamicMessageService.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 

Repository %
.% &
	Interface& /
{ 
public		 

	interface		 "
IDynamicMessageService		 +
{

 
public 
Task 
< 
DynamicMessage "
>" #
Get$ '
(' (
string( .

messageKey/ 9
)9 :
;: ;
} 
} ç
\D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Repository\Interface\IHttpsResponseRepository.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 

Repository %
.% &
	Interface& /
{		 
public

 

	interface

 $
IHttpsResponseRepository

 -
{ 
OkObjectResult 
ReturnResult #
(# $
APIStatusCode$ 1
apiStatusCode2 ?
,? @
APIStateA I
apiStateJ R
,R S
objectT Z
Data[ _
,_ `
UserMessagea l
Messagem t
)t u
;u v
Task 
< 
OkObjectResult 
> #
ReturnExceptionResponse 4
(4 5
	Exception5 >
e? @
)@ A
;A B
} 
} Ë
SD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Repository\Interface\IMongoDBContext.cs
	namespace 	
FJT
 
. 
ReportViewer 
. 

Repository %
.% &
	Interface& /
{ 
public		 

	interface		 
IMongoDBContext		 $
{

 
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
;, -
} 
} ¬

HD:\Development\FJT\FJT-DEV\FJT.ReportViewer\Repository\MongoDBContext.cs
	namespace

 	
FJT


 
.

 
ReportViewer

 
.

 

Repository

 %
{ 
public 

class 
MongoDBContext 
:  !
IMongoDBContext" 1
{ 
private 
readonly 
MongoDBConfig &
_mongoDBConfig' 5
;5 6
public 
MongoDBContext 
( 
IOptions &
<& '
MongoDBConfig' 4
>4 5
mongoDBConfig6 C
)C D
{ 	
_mongoDBConfig 
= 
mongoDBConfig *
.* +
Value+ 0
;0 1
} 	
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
{ 	
var 
client 
= 
new 
MongoClient (
(( )
_mongoDBConfig) 7
.7 8#
MongoDBConnectionString8 O
)O P
;P Q
return 
client 
. 
GetDatabase %
(% &
_mongoDBConfig& 4
.4 5
DBName5 ;
); <
;< =
} 	
} 
} ÅÜ
6D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Startup.cs
	namespace 	
FJT
 
. 
ReportViewer 
{ 
public 

class 
Startup 
{ 
public 
Startup 
( 
IConfiguration %
configuration& 3
)3 4
{ 	
Configuration 
= 
configuration )
;) *
} 	
public   
IConfiguration   
Configuration   +
{  , -
get  . 1
;  1 2
}  3 4
public!! 
static!! 
string!! 
IdentityServerURL!! .
{!!/ 0
get!!1 4
;!!4 5
set!!6 9
;!!9 :
}!!; <
public"" 
static"" 
string"" 
ClientId"" %
{""& '
get""( +
;""+ ,
set""- 0
;""0 1
}""2 3
public## 
static## 
bool## 
islocalhost## &
{##' (
get##) ,
;##, -
set##. 1
;##1 2
}##3 4
public&& 
void&& 
ConfigureServices&& %
(&&% &
IServiceCollection&&& 8
services&&9 A
)&&A B
{'' 	
var(( 
constantPath(( 
=(( 
Configuration(( ,
.((, -

GetSection((- 7
(((7 8
nameof((8 >
(((> ?
ConstantPath((? K
)((K L
)((L M
;((M N
var))  
identityserverConfig)) $
=))% &
Configuration))' 4
.))4 5

GetSection))5 ?
())? @
$str))@ V
)))V W
;))W X
Startup** 
.** 
IdentityServerURL** %
=**& '
constantPath**( 4
.**4 5
GetValue**5 =
(**= >
typeof**> D
(**D E
string**E K
)**K L
,**L M
$str**N a
)**a b
.**b c
ToString**c k
(**k l
)**l m
;**m n
Startup++ 
.++ 
ClientId++ 
=++  
identityserverConfig++ 3
.++3 4
GetValue++4 <
(++< =
typeof++= C
(++C D
string++D J
)++J K
,++K L
$str++M W
)++W X
.++X Y
ToString++Y a
(++a b
)++b c
;++c d
services-- 
.-- 
AddCors-- 
(-- 
options-- $
=>--% '
{.. 
options// 
.// 
	AddPolicy// !
(//! "
$str//" .
,//. /
builder00 
=>00 
builder00 &
.00& '
AllowAnyOrigin00' 5
(005 6
)006 7
.11 
AllowAnyMethod11 '
(11' (
)11( )
.22 
AllowAnyHeader22 '
(22' (
)22( )
)22) *
;22* +
}33 
)33 
;33 
services44 
.44 #
AddControllersWithViews44 ,
(44, -
)44- .
;44. /
string66 
mySqlConnectionStr66 %
=66& '
Configuration66( 5
.665 6
GetConnectionString666 I
(66I J
$str66J ]
)66] ^
;66^ _
services77 
.77 
AddDbContextPool77 %
<77% &
FJTSqlDBContext77& 5
>775 6
(776 7
options777 >
=>77? A
options77B I
.77I J
UseMySql77J R
(77R S
mySqlConnectionStr77S e
,77e f
ServerVersion77g t
.77t u

AutoDetect77u 
(	77 Ä 
mySqlConnectionStr
77Ä í
)
77í ì
)
77ì î
)
77î ï
;
77ï ñ
services99 
.99 %
AddDistributedMemoryCache99 .
(99. /
)99/ 0
;990 1
services:: 
.:: 

AddSession:: 
(::  
options::  '
=>::( *
{;; 
options<< 
.<< 
IdleTimeout<< #
=<<$ %
TimeSpan<<& .
.<<. /
FromMinutes<</ :
(<<: ;
$num<<; <
)<<< =
;<<= >
}== 
)== 
;== 
services@@ 
.@@ 
	Configure@@ 
<@@ 
ConstantPath@@ +
>@@+ ,
(@@, -
Configuration@@- :
.@@: ;

GetSection@@; E
(@@E F
nameof@@F L
(@@L M
ConstantPath@@M Y
)@@Y Z
)@@Z [
)@@[ \
;@@\ ]
servicesAA 
.AA 
	ConfigureAA 
<AA 
ConnectionStringsAA 0
>AA0 1
(AA1 2
ConfigurationAA2 ?
.AA? @

GetSectionAA@ J
(AAJ K
nameofAAK Q
(AAQ R
ConnectionStringsAAR c
)AAc d
)AAd e
)AAe f
;AAf g
servicesBB 
.BB 
	ConfigureBB 
<BB 
MongoDBConfigBB ,
>BB, -
(BB- .
ConfigurationBB. ;
.BB; <

GetSectionBB< F
(BBF G
nameofBBG M
(BBM N
MongoDBConfigBBN [
)BB[ \
)BB\ ]
)BB] ^
;BB^ _
servicesCC 
.CC 
	ConfigureCC 
<CC  
IdentityserverConfigCC 3
>CC3 4
(CC4 5
ConfigurationCC5 B
.CCB C

GetSectionCCC M
(CCM N
nameofCCN T
(CCT U 
IdentityserverConfigCCU i
)CCi j
)CCj k
)CCk l
;CCl m
servicesFF 
.FF 
	AddScopedFF 
<FF 
IMongoDBContextFF .
,FF. /
MongoDBContextFF0 >
>FF> ?
(FF? @
)FF@ A
;FFA B
servicesGG 
.GG 
	AddScopedGG 
<GG "
IDynamicMessageServiceGG 5
,GG5 6!
DynamicMessageServiceGG7 L
>GGL M
(GGM N
)GGN O
;GGO P
servicesHH 
.HH 
	AddScopedHH 
<HH $
IHttpsResponseRepositoryHH 7
,HH7 8#
HttpsResponseRepositoryHH9 P
>HHP Q
(HHQ R
)HHR S
;HHS T
StartupKK 
.KK 
islocalhostKK 
=KK  !
(KK" #
boolKK# '
)KK' (
ConfigurationKK( 5
.KK5 6
GetValueKK6 >
(KK> ?
typeofKK? E
(KKE F
boolKKF J
)KKJ K
,KKK L
$strKKM Z
)KKZ [
;KK[ \
servicesLL 
.LL 
AddAuthenticationLL &
(LL& '
$strLL' /
)LL/ 0
.MM 
AddJwtBearerMM 
(MM 
$strMM &
,MM& '
optionsMM( /
=>MM0 2
{NN 
ifOO 
(OO 
islocalhostOO #
)OO# $
{PP 
optionsQQ 
.QQ  "
BackchannelHttpHandlerQQ  6
=QQ7 8
newQQ9 <
HttpClientHandlerQQ= N
{QQO P5
)ServerCertificateCustomValidationCallbackQQQ z
=QQ{ |
delegate	QQ} Ö
{
QQÜ á
return
QQà é
true
QQè ì
;
QQì î
}
QQï ñ
}
QQó ò
;
QQò ô
}RR 
optionsSS 
.SS 
	AuthoritySS %
=SS& '
constantPathSS( 4
.SS4 5
GetValueSS5 =
(SS= >
typeofSS> D
(SSD E
stringSSE K
)SSK L
,SSL M
$strSSN a
)SSa b
.SSb c
ToStringSSc k
(SSk l
)SSl m
;SSm n
optionsTT 
.TT %
TokenValidationParametersTT 5
=TT6 7
newTT8 ;%
TokenValidationParametersTT< U
{UU 
ValidateAudienceVV (
=VV) *
falseVV+ 0
}WW 
;WW 
}XX 
)XX 
;XX 
varZZ 
identityserverURLZZ !
=ZZ" #
constantPathZZ$ 0
.ZZ0 1
GetValueZZ1 9
(ZZ9 :
typeofZZ: @
(ZZ@ A
stringZZA G
)ZZG H
,ZZH I
$strZZJ ]
)ZZ] ^
.ZZ^ _
ToStringZZ_ g
(ZZg h
)ZZh i
;ZZi j
var[[ 
clientId[[ 
=[[  
identityserverConfig[[ /
.[[/ 0
GetValue[[0 8
([[8 9
typeof[[9 ?
([[? @
string[[@ F
)[[F G
,[[G H
$str[[I S
)[[S T
.[[T U
ToString[[U ]
([[] ^
)[[^ _
;[[_ `
var\\ 
clientSecret\\ 
=\\  
identityserverConfig\\ 3
.\\3 4
GetValue\\4 <
(\\< =
typeof\\= C
(\\C D
string\\D J
)\\J K
,\\K L
$str\\M [
)\\[ \
.\\\ ]
ToString\\] e
(\\e f
)\\f g
;\\g h
var]]  
authenticationScheme]] $
=]]% & 
identityserverConfig]]' ;
.]]; <
GetValue]]< D
(]]D E
typeof]]E K
(]]K L
string]]L R
)]]R S
,]]S T
$str]]U k
)]]k l
.]]l m
ToString]]m u
(]]u v
)]]v w
;]]w x
services^^ 
.^^ 
AddAuthentication^^ &
(^^& '
options^^' .
=>^^/ 1
{__ 
options`` 
.`` 
DefaultScheme`` %
=``& ' 
authenticationScheme``( <
;``< =
optionsaa 
.aa "
DefaultChallengeSchemeaa .
=aa/ 0
ConstantHelperaa1 ?
.aa? @3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEMEaa@ g
;aag h
}bb 
)bb 
.bb 
	AddCookiebb 
(bb  
authenticationSchemebb -
,bb- .
optionsbb/ 6
=>bb7 9
{cc 
optionsdd 
.dd 
ExpireTimeSpandd &
=dd' (
TimeSpandd) 1
.dd1 2
FromDaysdd2 :
(dd: ;
$numdd; =
)dd= >
;dd> ?
optionsee 
.ee 
SlidingExpirationee )
=ee* +
trueee, 0
;ee0 1
optionsff 
.ff 
SessionStoreff $
=ff% &
newff' *"
MemoryCacheTicketStoreff+ A
(ffA B
)ffB C
;ffC D
}gg 
)gg 
.hh 
AddOpenIdConnecthh !
(hh! "
ConstantHelperhh" 0
.hh0 13
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEMEhh1 X
,hhX Y
optionshhZ a
=>hhb d
{ii 
ifjj 
(jj 
islocalhostjj #
)jj# $
{kk 
optionsll 
.ll  "
BackchannelHttpHandlerll  6
=ll7 8
newll9 <
HttpClientHandlerll= N
{llO P5
)ServerCertificateCustomValidationCallbackllQ z
=ll{ |
delegate	ll} Ö
{
llÜ á
return
llà é
true
llè ì
;
llì î
}
llï ñ
}
lló ò
;
llò ô
}mm 
optionsnn 
.nn 
	Authoritynn %
=nn& '
identityserverURLnn( 9
;nn9 :
optionsoo 
.oo 
ClientIdoo $
=oo% &
clientIdoo' /
;oo/ 0
optionspp 
.pp 
ClientSecretpp (
=pp) *
clientSecretpp+ 7
;pp7 8
optionsrr 
.rr )
GetClaimsFromUserInfoEndpointrr 9
=rr: ;
truerr< @
;rr@ A
optionsss 
.ss 
ClaimActionsss (
.ss( )
MapUniqueJsonKeyss) 9
(ss9 :
$strss: @
,ss@ A
$strssB L
)ssL M
;ssM N
optionsuu 
.uu 
ResponseTypeuu (
=uu) *
$struu+ 1
;uu1 2
optionsvv 
.vv 
UsePkcevv #
=vv$ %
truevv& *
;vv* +
optionsww 
.ww 
CallbackPathww (
=ww) *
$strww+ :
;ww: ;
optionsxx 
.xx 
Scopexx !
.xx! "
Addxx" %
(xx% &
$strxx& .
)xx. /
;xx/ 0
optionsyy 
.yy 
Scopeyy !
.yy! "
Addyy" %
(yy% &
$stryy& /
)yy/ 0
;yy0 1
optionszz 
.zz 
Scopezz !
.zz! "
Addzz" %
(zz% &
$strzz& 7
)zz7 8
;zz8 9
options{{ 
.{{ 
Scope{{ !
.{{! "
Add{{" %
({{% &
$str{{& 9
){{9 :
;{{: ;
options|| 
.|| 
Scope|| !
.||! "
Add||" %
(||% &
$str||& 6
)||6 7
;||7 8
options}} 
.}} !
SignedOutCallbackPath}} 1
=}}2 3
$str}}4 >
;}}> ?
options~~ 
.~~ 

SaveTokens~~ &
=~~' (
true~~) -
;~~- .
options 
. 
Events "
=# $
new% (
OpenIdConnectEvents) <
{
ÄÄ 
OnTokenValidated
ÑÑ (
=
ÑÑ) *
x
ÑÑ+ ,
=>
ÑÑ- /
{
ÖÖ 
var
áá 
identity
áá  (
=
áá) *
(
áá+ ,
ClaimsIdentity
áá, :
)
áá: ;
x
áá; <
.
áá< =
	Principal
áá= F
.
ááF G
Identity
ááG O
;
ááO P
identity
àà $
.
àà$ %
	AddClaims
àà% .
(
àà. /
new
àà/ 2
[
àà2 3
]
àà3 4
{
ââ 
new
ää  #
Claim
ää$ )
(
ää) *
$str
ää* 8
,
ää8 9
x
ää: ;
.
ää; <#
TokenEndpointResponse
ää< Q
.
ääQ R
AccessToken
ääR ]
)
ää] ^
,
ää^ _
new
ãã  #
Claim
ãã$ )
(
ãã) *
$str
ãã* 9
,
ãã9 :
x
ãã; <
.
ãã< =#
TokenEndpointResponse
ãã= R
.
ããR S
RefreshToken
ããS _
)
ãã_ `
}
åå 
)
åå 
;
åå 
x
èè 
.
èè 

Properties
èè (
.
èè( )
IsPersistent
èè) 5
=
èè6 7
true
èè8 <
;
èè< =
return
êê "
Task
êê# '
.
êê' (
CompletedTask
êê( 5
;
êê5 6
}
ëë 
}
íí 
;
íí 
}
ìì 
)
ìì 
;
ìì 
}
ïï 	
public
òò 
void
òò 
	Configure
òò 
(
òò !
IApplicationBuilder
òò 1
app
òò2 5
,
òò5 6!
IWebHostEnvironment
òò7 J
env
òòK N
)
òòN O
{
ôô 	
app
öö 
.
öö 
UseCors
öö 
(
öö 
$str
öö $
)
öö$ %
;
öö% &
if
úú 
(
úú 
env
úú 
.
úú 
IsDevelopment
úú !
(
úú! "
)
úú" #
)
úú# $
{
ùù 
app
ûû 
.
ûû '
UseDeveloperExceptionPage
ûû -
(
ûû- .
)
ûû. /
;
ûû/ 0
}
üü 
else
†† 
{
°° 
app
¢¢ 
.
¢¢ !
UseExceptionHandler
¢¢ '
(
¢¢' (
$str
¢¢( 7
)
¢¢7 8
;
¢¢8 9
app
§§ 
.
§§ 
UseHsts
§§ 
(
§§ 
)
§§ 
;
§§ 
}
•• 
app
ßß 
.
ßß !
UseHttpsRedirection
ßß #
(
ßß# $
)
ßß$ %
;
ßß% &
app
®® 
.
®® 
UseStaticFiles
®® 
(
®® 
)
®®  
;
®®  !
app
™™ 
.
™™ 

UseSession
™™ 
(
™™ 
)
™™ 
;
™™ 
app
¨¨ 
.
¨¨ $
UseRequestLocalization
¨¨ &
(
¨¨& '
)
¨¨' (
;
¨¨( )
app
ÆÆ 
.
ÆÆ 

UseRouting
ÆÆ 
(
ÆÆ 
)
ÆÆ 
;
ÆÆ 
app
∞∞ 
.
∞∞ 
UseAuthentication
∞∞ !
(
∞∞! "
)
∞∞" #
;
∞∞# $
app
±± 
.
±± 
UseAuthorization
±±  
(
±±  !
)
±±! "
;
±±" #
app
≥≥ 
.
≥≥ 
UseEndpoints
≥≥ 
(
≥≥ 
	endpoints
≥≥ &
=>
≥≥' )
{
¥¥ 
	endpoints
µµ 
.
µµ  
MapControllerRoute
µµ ,
(
µµ, -
name
∂∂ 
:
∂∂ 
$str
∂∂ #
,
∂∂# $
pattern
∑∑ 
:
∑∑ 
$str
∑∑ G
)
∑∑G H
;
∑∑H I
}
∏∏ 
)
∏∏ 
;
∏∏ 
}
ππ 	
}
∫∫ 
}ªª 
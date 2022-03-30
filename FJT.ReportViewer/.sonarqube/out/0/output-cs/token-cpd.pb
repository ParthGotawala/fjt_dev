�
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
} �
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
} �
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
} �
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
} �
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
accessDeniedMSG	} �
.
� �
message
� �
,
� �
	REQUESTED
� �
)
� �
}
� �
)
� �
;
� �
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
}## �
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
} ��
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

ClaimTypes	II{ �
.
II� �
NameIdentifier
II� �
)
II� �
.
II� �
Value
II� �
:
II� �
null
II� �
;
II� �
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
true	MM �
;
MM� �
}
MM� �
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
responseModelString	^^| �
)
^^� �
)
^^� �
.
^^� �
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
action	ee �
=
ee� �
$str
ee� �
}
ee� �
)
ee� �
)
ee� �
;
ee� �
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
�� 
else
�� 
{
�� 
var
�� #
dynamicMessageService
��  5
=
��6 7
(
��8 9$
IDynamicMessageService
��9 O
)
��O P
filterContext
��P ]
.
��] ^
HttpContext
��^ i
.
��i j
RequestServices
��j y
.
��y z

GetService��z �
(��� �
typeof��� �
(��� �&
IDynamicMessageService��� �
)��� �
)��� �
;��� �
var
�� 
accessDeniedMSG
��  /
=
��0 1
await
��2 7#
dynamicMessageService
��8 M
.
��M N
Get
��N Q
(
��Q R!
POPUP_ACCESS_DENIED
��R e
)
��e f
;
��f g
ApiResponse
�� '
res
��( +
=
��, -
new
��. 1
ApiResponse
��2 =
(
��= >
)
��> ?
{
�� 
apiStatusCode
��  -
=
��. /
APIStatusCode
��0 =
.
��= >
ERROR
��> C
,
��C D
status
��  &
=
��' (
APIState
��) 1
.
��1 2
FAILED
��2 8
.
��8 9
GetDisplayValue
��9 H
(
��H I
)
��I J
,
��J K
userMessage
��  +
=
��, -
new
��. 1
UserMessage
��2 =
{
��> ?
messageContent
��@ N
=
��O P
new
��Q T
MessageContent
��U c
{
��d e
messageType
��f q
=
��r s
accessDeniedMSG��t �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
accessDeniedMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
accessDeniedMSG��� �
.��� �
message��� �
,��� �
PROJECT_NAME��� �
)��� �
}��� �
}��� �
}
�� 
;
�� 
filterContext
�� )
.
��) *
Result
��* 0
=
��1 2
new
��3 6
OkObjectResult
��7 E
(
��E F
res
��F I
)
��I J
;
��J K
}
�� 
}
�� 
else
�� 
{
�� 
if
�� 
(
�� 
apiResponse
�� '
.
��' (
data
��( ,
!=
��- /
null
��0 4
&&
��5 7
apiResponse
��8 C
.
��C D
data
��D H
.
��H I
ToString
��I Q
(
��Q R
)
��R S
==
��T V
$str
��W h
)
��h i
{
�� 
filterContext
�� )
.
��) *
Result
��* 0
=
��1 2
new
��3 6#
RedirectToRouteResult
��7 L
(
��L M
new
��M P"
RouteValueDictionary
��Q e
(
��e f
new
��f i
{
��j k

controller
��l v
=
��w x
$str��y �
,��� �
action��� �
=��� �
$str��� �
}��� �
)��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
filterContext
�� )
.
��) *
Result
��* 0
=
��1 2
new
��3 6#
RedirectToRouteResult
��7 L
(
��L M
new
��M P"
RouteValueDictionary
��Q e
(
��e f
new
��f i
{
��j k

controller
��l v
=
��w x
$str��y �
,��� �
action��� �
=��� �
$str��� �
}��� �
)��� �
)��� �
;��� �
}
�� 
}
�� 
}
�� 
}
�� 
}
�� 	
public
�� 
override
�� 
void
�� 
OnResultExecuted
�� -
(
��- .#
ResultExecutedContext
��. C
filterContext
��D Q
)
��Q R
{
�� 	
CustomClaim
�� 
(
�� 
$str
�� *
,
��* +
filterContext
��, 9
.
��9 :
	RouteData
��: C
)
��C D
;
��D E
}
�� 	
public
�� 
override
�� 
void
�� 
OnResultExecuting
�� .
(
��. /$
ResultExecutingContext
��/ E
filterContext
��F S
)
��S T
{
�� 	
CustomClaim
�� 
(
�� 
$str
�� ,
,
��, -
filterContext
��. ;
.
��; <
	RouteData
��< E
)
��E F
;
��F G
}
�� 	
private
�� 
void
�� 
CustomClaim
��  
(
��  !
string
��! '

methodName
��( 2
,
��2 3
	RouteData
��4 =
	routeData
��> G
)
��G H
{
�� 	
var
�� 
controllerName
�� 
=
��  
	routeData
��! *
.
��* +
Values
��+ 1
[
��1 2
$str
��2 >
]
��> ?
;
��? @
var
�� 

actionName
�� 
=
�� 
	routeData
�� &
.
��& '
Values
��' -
[
��- .
$str
��. 6
]
��6 7
;
��7 8
var
�� 
message
�� 
=
�� 
String
��  
.
��  !
Format
��! '
(
��' (
$str
��( H
,
��H I

methodName
��J T
,
��T U
controllerName
��H V
,
��V W

actionName
��H R
)
��R S
;
��S T
}
�� 	
}
�� 
}�� �
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
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME	h �
}
� �
)
� �
;
� �
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
}// �?
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
ILogger	{ �
<
� �
UtilityController
� �
>
� �
logger
� �
)
� �
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
TotalMilliseconds	..v �
;
..� �
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
return	55| �
true
55� �
;
55� �
}
55� �
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
}VV ��
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
ConstantPath	,,u �
>
,,� �
constantPath
,,� �
,
,,� �
IOptions
,,� �
<
,,� �
ConnectionStrings
,,� �
>
,,� �
connectionStrings
,,� �
,
,,� �
ILogger
,,� �
<
,,� �
ViewerController
,,� �
>
,,� �
logger
,,� �
,
,,� �$
IDynamicMessageService
,,� �#
dynamicMessageService
,,� �
)
,,� �
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
	isDeleted	EE} �
==
EE� �
false
EE� �
)
EE� �
.
EE� �
Select
EE� �
(
EE� �
x
EE� �
=>
EE� �
x
EE� �
.
EE� �
reportId
EE� �
)
EE� �
.
EE� �!
FirstOrDefaultAsync
EE� �
(
EE� �
)
EE� �
;
EE� �
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
Select	HH| �
(
HH� �
x
HH� �
=>
HH� �
new
HH� �
{
HH� �
x
HH� �
.
HH� �

reportName
HH� �
,
HH� �
x
HH� �
.
HH� �"
reportGenerationType
HH� �
,
HH� �
x
HH� �
.
HH� �
fileName
HH� �
,
HH� �
x
HH� �
.
HH� �
status
HH� �
,
HH� �
x
HH� �
.
HH� �
isEndUserReport
HH� �
}
HH� �
)
HH� �
.
HH� �!
FirstOrDefaultAsync
HH� �
(
HH� �
)
HH� �
;
HH� �
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
REPORT_DETAILS	KKx �
}
KK� �
)
KK� �
;
KK� �
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
true	RR �
;
RR� �
}
RR� �
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
isEndUserReport	XXy �
+
XX� �
$str
XX� �
+
XX� �
reportmaster
XX� �
.
XX� �"
reportGenerationType
XX� �
;
XX� �
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
somethingWrongMSG	bb �
.
bb� �
message
bb� �
}
bb� �
)
bb� �
;
bb� �
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
(	ee �!
responseModelString
ee� �
)
ee� �
)
ee� �
.
ee� �
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
PAGE_NOT_FOUND	kkx �
:
kk� �
(
kk� �
int
kk� �
)
kk� �
APIStatusCode
kk� �
.
kk� �#
INTERNAL_SERVER_ERROR
kk� �
,
kk� �
Message
kk� �
=
kk� �
responseModel
kk� �
.
kk� �
	IsSuccess
kk� �
?
kk� �
string
kk� �
.
kk� �
Format
kk� �
(
kk� �
notExistsMSG
kk� �
.
kk� �
message
kk� �
,
kk� �
REPORT_ENTITY
kk� �
)
kk� �
:
kk� �
somethingWrongMSG
kk� �
.
kk� �
message
kk� �
}
kk� �
)
kk� �
;
kk� �
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
ReportStatus	qq �
.
qq� �
	Published
qq� �
.
qq� �
ToString
qq� �
(
qq� �
)
qq� �
;
qq� �
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
Message	xx} �
}
xx� �
)
xx� �
;
xx� �
}yy 
}zz 	
[
�� 	
	Authorize
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
	GetReport
��) 2
(
��2 3
string
��3 9
id
��: <
)
��< =
{
�� 	
try
�� 
{
�� 
var
�� 
parameterGuid
�� !
=
��" #
Guid
��$ (
.
��( )
Parse
��) .
(
��. /
id
��/ 1
)
��1 2
;
��2 3#
reportviewerparameter
�� %#
reportviewerparameter
��& ;
=
��< =
await
��> C
_FJTSqlDBContext
��D T
.
��T U#
reportviewerparameter
��U j
.
��j k
Where
��k p
(
��p q
x
��q r
=>
��s u
x
��v w
.
��w x
parameterGUID��x �
==��� �
parameterGuid��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
reportmaster
�� 
reportmaster
�� )
=
��* +
await
��, 1
_FJTSqlDBContext
��2 B
.
��B C
reportmaster
��C O
.
��O P
Where
��P U
(
��U V
x
��V W
=>
��X Z
x
��[ \
.
��\ ]
id
��] _
==
��` b#
reportviewerparameter
��c x
.
��x y
reportId��y �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
var
�� 
reportApiURL
��  
=
��! "
_constantPath
��# 0
.
��0 1
ReportApiURL
��1 =
+
��> ?"
GET_REPORT_BYTE_DATA
��@ T
;
��T U
var
�� 
accessToken
�� 
=
��  !
HttpContext
��" -
.
��- .
GetTokenAsync
��. ;
(
��; <
$str
��< J
)
��J K
;
��K L
HttpClientHandler
�� !
handler
��" )
=
��* +
new
��, /
HttpClientHandler
��0 A
{
�� 7
)ServerCertificateCustomValidationCallback
�� =
=
��> ?
(
��@ A 
httpRequestMessage
��A S
,
��S T
cert
��U Y
,
��Y Z
cetChain
��[ c
,
��c d
policyErrors
��e q
)
��q r
=>
��s u
{
��v w
return
��x ~
true�� �
;��� �
}��� �
}
�� 
;
�� 

HttpClient
�� 
client
�� !
=
��" #
Startup
��$ +
.
��+ ,
islocalhost
��, 7
?
��8 9
new
��: =

HttpClient
��> H
(
��H I
handler
��I P
)
��P Q
:
��R S
new
��T W

HttpClient
��X b
(
��b c
)
��c d
;
��d e
client
�� 
.
�� #
DefaultRequestHeaders
�� ,
.
��, -
Authorization
��- :
=
��; <
new
��= @'
AuthenticationHeaderValue
��A Z
(
��Z [
$str
��[ c
,
��c d
accessToken
��e p
.
��p q
Result
��q w
)
��w x
;
��x y
var
�� 
	urlstring
�� 
=
�� 
reportApiURL
��  ,
+
��- .
$str
��/ ;
+
��< =
reportmaster
��> J
.
��J K
fileName
��K S
+
��T U
$str
��V i
+
��j k
reportmaster
��l x
.
��x y
isEndUserReport��y �
+��� �
$str��� �
+��� �
reportmaster��� �
.��� �$
reportGenerationType��� �
;��� �
var
�� 
response
�� 
=
�� 
await
�� $
client
��% +
.
��+ ,
GetAsync
��, 4
(
��4 5
	urlstring
��5 >
)
��> ?
;
��? @
response
�� 
.
�� %
EnsureSuccessStatusCode
�� 0
(
��0 1
)
��1 2
;
��2 3
var
�� !
responseModelString
�� '
=
��( )
await
��* /
response
��0 8
.
��8 9
Content
��9 @
.
��@ A
ReadAsStringAsync
��A R
(
��R S
)
��S T
;
��T U
var
�� 
responseModel
�� !
=
��" #
(
��$ %
ResponseModel
��% 2
)
��2 3
(
��3 4
(
��4 5

Newtonsoft
��5 ?
.
��? @
Json
��@ D
.
��D E
Linq
��E I
.
��I J
JObject
��J Q
)
��Q R

Newtonsoft
��R \
.
��\ ]
Json
��] a
.
��a b
JsonConvert
��b m
.
��m n
DeserializeObject
��n 
(�� �#
responseModelString��� �
)��� �
)��� �
.��� �
ToObject
��  
(
��  !
typeof
��! '
(
��' (
ResponseModel
��( 5
)
��5 6
)
��6 7
;
��7 8
ReportByteDataVM
��  
reportByteDataVM
��! 1
=
��2 3
(
��4 5
ReportByteDataVM
��5 E
)
��E F
(
��F G
(
��G H

Newtonsoft
��H R
.
��R S
Json
��S W
.
��W X
Linq
��X \
.
��\ ]
JObject
��] d
)
��d e

Newtonsoft
��e o
.
��o p
Json
��p t
.
��t u
JsonConvert��u �
.��� �!
DeserializeObject��� �
(��� �
responseModel��� �
.��� �
Model��� �
.��� �
ToString��� �
(��� �
)��� �
)��� �
)��� �
.��� �
ToObject
��  
(
��  !
typeof
��! '
(
��' (
ReportByteDataVM
��( 8
)
��8 9
)
��9 :
;
��: ;
var
�� 
reportByteData
�� "
=
��# $
reportByteDataVM
��% 5
.
��5 6
ReportByteData
��6 D
;
��D E
var
�� 
companyInfo
�� 
=
��  !
await
��" '
_FJTSqlDBContext
��( 8
.
��8 9
CompanyInfos
��9 E
.
��E F
Include
��F M
(
��M N
x
��N O
=>
��P R
x
��S T
.
��T U

Mfgcodemst
��U _
)
��_ `
.
��` a
Select
��a g
(
��g h
x
��h i
=>
��j l
new
��m p
{
��q r
x
��s t
.
��t u

Mfgcodemst
��u 
.�� �
mfgCode��� �
}��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
var
�� 
report
�� 
=
�� 
new
��  
	StiReport
��! *
(
��* +
)
��+ ,
;
��, -
report
�� 
.
�� 
Load
�� 
(
�� 
reportByteData
�� *
)
��* +
;
��+ ,
report
�� 
.
�� 

ReportName
�� !
=
��" ##
reportviewerparameter
��$ 9
.
��9 :

reportName
��: D
!=
��E G
null
��H L
?
��M N
companyInfo
��O Z
.
��Z [
mfgCode
��[ b
+
��c d#
reportviewerparameter
��e z
.
��z {

reportName��{ �
:��� �
reportmaster��� �
.��� �

reportName��� �
;��� �
StiDictionary
�� 

dictionary
�� (
=
��) *
report
��+ 1
.
��1 2

Dictionary
��2 <
;
��< =
var
�� 
dbList
�� 
=
�� 

dictionary
�� '
.
��' (
	Databases
��( 1
.
��1 2
ToList
��2 8
(
��8 9
)
��9 :
;
��: ;
for
�� 
(
�� 
int
�� 
i
�� 
=
�� 
$num
�� 
;
�� 
i
��  !
<
��" #
dbList
��$ *
.
��* +
Count
��+ 0
;
��0 1
i
��2 3
++
��3 5
)
��5 6
{
�� 
(
�� 
(
�� 
StiSqlDatabase
�� $
)
��$ %

dictionary
��% /
.
��/ 0
	Databases
��0 9
[
��9 :
i
��: ;
]
��; <
)
��< =
.
��= >
ConnectionString
��> N
=
��O P 
_connectionStrings
��Q c
.
��c d
ReportConnection
��d t
;
��t u
}
�� 
var
�� 
variableList
��  
=
��! "

dictionary
��# -
.
��- .
	Variables
��. 7
.
��7 8
ToList
��8 >
(
��> ?
)
��? @
;
��@ A
foreach
�� 
(
�� 
var
�� 
item
�� !
in
��" $
variableList
��% 1
)
��1 2
{
�� 
item
�� 
.
�� 
Value
�� 
=
��  
null
��! %
;
��% &
}
�� 
foreach
�� 
(
�� 
var
�� 
variableName
�� )
in
��* ,
Enum
��- 1
.
��1 2
GetNames
��2 :
(
��: ;
typeof
��; A
(
��A B$
ConstantReportVariable
��B X
)
��X Y
)
��Y Z
)
��Z [
{
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� .
(
��. /
variableName
��/ ;
)
��; <
)
��< =
{
�� $
ConstantReportVariable
�� .
reportVariable
��/ =
=
��> ?
(
��@ A$
ConstantReportVariable
��A W
)
��W X
Enum
��X \
.
��\ ]
Parse
��] b
(
��b c
typeof
��c i
(
��i j%
ConstantReportVariable��j �
)��� �
,��� �
variableName��� �
)��� �
;��� �

dictionary
�� "
.
��" #
	Variables
��# ,
[
��, -
variableName
��- 9
]
��9 :
.
��: ;
Value
��; @
=
��A B
reportVariable
��C Q
.
��Q R
GetDisplayValue
��R a
(
��a b
)
��b c
;
��c d
}
�� 
}
�� 
FilterParameters
��  
filterParameters
��! 1
=
��2 3
new
��4 7
FilterParameters
��8 H
(
��H I
)
��I J
;
��J K
if
�� 
(
�� 
!
�� 
String
�� 
.
�� 
IsNullOrEmpty
�� )
(
��) *#
reportviewerparameter
��* ?
.
��? @
parameterValues
��@ O
)
��O P
)
��P Q
{
�� 
filterParameters
�� $
=
��% &
(
��' (
FilterParameters
��( 8
)
��8 9
(
��9 :
(
��: ;

Newtonsoft
��; E
.
��E F
Json
��F J
.
��J K
Linq
��K O
.
��O P
JObject
��P W
)
��W X

Newtonsoft
��X b
.
��b c
Json
��c g
.
��g h
JsonConvert
��h s
.
��s t 
DeserializeObject��t �
(��� �%
reportviewerparameter��� �
.��� �
parameterValues��� �
)��� �
)��� �
.��� �
ToObject
��@ H
(
��H I
typeof
��I O
(
��O P
FilterParameters
��P `
)
��` a
)
��a b
;
��b c
}
�� 
PropertyInfo
�� 
[
�� 
]
�� (
filterParametersProperties
�� 9
=
��: ;
filterParameters
��< L
.
��L M
GetType
��M T
(
��T U
)
��U V
.
��V W
GetProperties
��W d
(
��d e
)
��e f
;
��f g
var
�� '
reportmasterparameterList
�� -
=
��. /
await
��0 5
_FJTSqlDBContext
��6 F
.
��F G#
reportmasterparameter
��G \
.
��\ ]
Where
��] b
(
��b c
x
��c d
=>
��e g
x
��h i
.
��i j
reportId
��j r
==
��s u
reportmaster��v �
.��� �
id��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �!
parmeterMappingid��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
var
��  
param_DbColumnList
�� &
=
��' (
await
��) .
_FJTSqlDBContext
��/ ?
.
��? @.
 report_parameter_setting_mapping
��@ `
.
��` a
Where
��a f
(
��f g
x
��g h
=>
��i k(
reportmasterparameterList��l �
.��� �
Any��� �
(��� �
paramId��� �
=>��� �
x��� �
.��� �
id��� �
==��� �
paramId��� �
)��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
new��� �
{��� �
x��� �
.��� �
reportParamName��� �
,��� �
x��� �
.��� �
dbColumnName��� �
}��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
foreach
�� 
(
�� 
var
�� 
item
�� !
in
��" $ 
param_DbColumnList
��% 7
)
��7 8
{
�� 
var
�� 
valueObj
��  
=
��! "(
filterParametersProperties
��# =
.
��= >
Where
��> C
(
��C D
x
��D E
=>
��F H
x
��I J
.
��J K
Name
��K O
==
��P R
item
��S W
.
��W X
dbColumnName
��X d
)
��d e
.
��e f
Select
��f l
(
��l m
x
��m n
=>
��o q
x
��r s
.
��s t
GetValue
��t |
(
��| }
filterParameters��} �
)��� �
)��� �
.��� �
FirstOrDefault��� �
(��� �
)��� �
;��� �
var
�� 

paramValue
�� "
=
��# $
string
��% +
.
��+ ,
Empty
��, 1
;
��1 2
if
�� 
(
�� 
valueObj
��  
!=
��! #
null
��$ (
)
��( )
{
�� 

paramValue
�� "
=
��# $
valueObj
��% -
.
��- .
ToString
��. 6
(
��6 7
)
��7 8
;
��8 9
}
�� 
var
�� 
stiVariable
�� #
=
��$ %

dictionary
��& 0
.
��0 1
	Variables
��1 :
[
��: ;
item
��; ?
.
��? @
reportParamName
��@ O
]
��O P
;
��P Q
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� .
(
��. /
item
��/ 3
.
��3 4
reportParamName
��4 C
)
��C D
)
��D E
{
�� 

dictionary
�� "
.
��" #
	Variables
��# ,
[
��, -
item
��- 1
.
��1 2
reportParamName
��2 A
]
��A B
.
��B C
Value
��C H
=
��I J

paramValue
��K U
;
��U V
}
�� 
else
�� 
{
�� 

dictionary
�� "
.
��" #
	Variables
��# ,
.
��, -
Add
��- 0
(
��0 1
$str
��1 3
,
��3 4
item
��5 9
.
��9 :
reportParamName
��: I
,
��I J
item
��K O
.
��O P
reportParamName
��P _
,
��_ `

paramValue
��a k
)
��k l
;
��l m
}
�� 
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� *
(
��* +
PARA_REPORT_TITLE
��+ <
)
��< =
)
��= >
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )
PARA_REPORT_TITLE
��) :
]
��: ;
.
��; <
Value
��< A
=
��B C
reportmaster
��D P
.
��P Q
reportTitle
��Q \
;
��\ ]
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� *
(
��* +!
PARA_REPORT_VERSION
��+ >
)
��> ?
)
��? @
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )!
PARA_REPORT_VERSION
��) <
]
��< =
.
��= >
Value
��> C
=
��D E
reportmaster
��F R
.
��R S
reportVersion
��S `
??
��a c
$str
��d g
;
��g h
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� *
(
��* +'
Para_ROHS_ImageFolderPath
��+ D
)
��D E
)
��E F
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )'
Para_ROHS_ImageFolderPath
��) B
]
��B C
.
��C D
Value
��D I
=
��J K
string
��L R
.
��R S
Concat
��S Y
(
��Y Z
_constantPath
��Z g
.
��g h
APIURL
��h n
,
��n o
_constantPath
��p }
.
��} ~
RoHSImagesPath��~ �
)��� �
;��� �
}
�� 
await
�� 
report
�� 
.
�� 
RenderAsync
�� (
(
��( )
)
��) *
;
��* +
return
�� 
StiNetCoreViewer
�� '
.
��' (
GetReportResult
��( 7
(
��7 8
this
��8 <
,
��< =
report
��> D
)
��D E
;
��E F
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
var
�� 
report
�� 
=
�� 
new
��  
	StiReport
��! *
(
��* +
)
��+ ,
;
��, -
report
�� 
.
�� 
Load
�� 
(
�� 
StiNetCoreHelper
�� ,
.
��, -
MapPath
��- 4
(
��4 5
this
��5 9
,
��9 :
$str
��; T
)
��T U
)
��U V
;
��V W
report
�� 
.
�� 

Dictionary
�� !
.
��! "
	Variables
��" +
[
��+ ,
$str
��, 8
]
��8 9
.
��9 :
Value
��: ?
=
��@ A
e
��B C
.
��C D
Message
��D K
;
��K L
report
�� 
.
�� 

ReportName
�� !
=
��" #
$str
��$ +
;
��+ ,
return
�� 
StiNetCoreViewer
�� '
.
��' (
GetReportResult
��( 7
(
��7 8
this
��8 <
,
��< =
report
��> D
)
��D E
;
��E F
}
�� 
}
�� 	
[
�� 	
	Authorize
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
ViewerEvent
��) 4
(
��4 5
)
��5 6
{
�� 	
return
�� 
await
�� 
StiNetCoreViewer
�� )
.
��) *$
ViewerEventResultAsync
��* @
(
��@ A
this
��A E
)
��E F
;
��F G
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
DownloadReport
��) 7
(
��7 8
[
��8 9
FromBody
��9 A
]
��A B
DownlodReportVM
��C R
downlodReportVM
��S b
)
��b c
{
�� 	
if
�� 
(
�� 
downlodReportVM
�� 
==
��  "
null
��# '
)
��' (
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
ApiResponse
�� 
badRequestRes
�� )
=
��* +
new
��, /
ApiResponse
��0 ;
(
��; <
)
��< =
{
�� 
userMessage
�� 
=
��  !
new
��" %
UserMessage
��& 1
(
��1 2
)
��2 3
{
��4 5
messageContent
��6 D
=
��E F
new
��G J
MessageContent
��K Y
{
��Z [
messageType
��\ g
=
��h i!
invalidParameterMSG
��j }
.
��} ~
messageType��~ �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
}
�� 
;
�� 
return
�� 

BadRequest
�� !
(
��! "
badRequestRes
��" /
)
��/ 0
;
��0 1
}
�� 
try
�� 
{
�� 
var
�� 
parameterGuid
�� !
=
��" #
Guid
��$ (
.
��( )
Parse
��) .
(
��. /
downlodReportVM
��/ >
.
��> ?
ParameterGuid
��? L
)
��L M
;
��M N#
reportviewerparameter
�� %#
reportviewerparameter
��& ;
=
��< =
await
��> C
_FJTSqlDBContext
��D T
.
��T U#
reportviewerparameter
��U j
.
��j k!
FirstOrDefaultAsync
��k ~
(
��~ 
x�� �
=>��� �
x��� �
.��� �
parameterGUID��� �
==��� �
parameterGuid��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
reportmaster
�� 
reportmaster
�� )
=
��* +
await
��, 1
_FJTSqlDBContext
��2 B
.
��B C
reportmaster
��C O
.
��O P!
FirstOrDefaultAsync
��P c
(
��c d
x
��d e
=>
��f h
x
��i j
.
��j k
id
��k m
==
��n p$
reportviewerparameter��q �
.��� �
reportId��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
reportmaster
��  
==
��! #
null
��$ (
)
��( )
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
ApiResponse
�� 
notFoundRes
��  +
=
��, -
new
��. 1
ApiResponse
��2 =
(
��= >
)
��> ?
{
�� 
userMessage
�� #
=
��$ %
new
��& )
UserMessage
��* 5
{
��6 7
messageContent
��8 F
=
��G H
new
��I L
MessageContent
��M [
{
��\ ]
messageType
��^ i
=
��j k
notFoundMSG
��l w
.
��w x
messageType��x �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �
REPORT_DETAILS��� �
)��� �
}��� �
}��� �
}
�� 
;
�� 
return
�� 
NotFound
�� #
(
��# $
notFoundRes
��$ /
)
��/ 0
;
��0 1
}
�� 
var
�� 
reportApiURL
��  
=
��! "
_constantPath
��# 0
.
��0 1
ReportApiURL
��1 =
+
��> ?)
CHECK_STATUS_OF_REPORT_FILE
��@ [
;
��[ \
string
��  
authorizationToken
�� )
=
��* +
HttpContext
��, 7
.
��7 8
Request
��8 ?
.
��? @
Headers
��@ G
[
��G H
$str
��H W
]
��W X
;
��X Y
string
�� 
[
�� 
]
�� 
authorsList
�� $
=
��% & 
authorizationToken
��' 9
.
��9 :
Split
��: ?
(
��? @
$str
��@ C
)
��C D
;
��D E
HttpClientHandler
�� !
handler
��" )
=
��* +
new
��, /
HttpClientHandler
��0 A
{
�� 7
)ServerCertificateCustomValidationCallback
�� =
=
��> ?
(
��@ A 
httpRequestMessage
��A S
,
��S T
cert
��U Y
,
��Y Z
cetChain
��[ c
,
��c d
policyErrors
��e q
)
��q r
=>
��s u
{
��v w
return
��x ~
true�� �
;��� �
}��� �
}
�� 
;
�� 

HttpClient
�� 
client
�� !
=
��" #
Startup
��$ +
.
��+ ,
islocalhost
��, 7
?
��8 9
new
��: =

HttpClient
��> H
(
��H I
handler
��I P
)
��P Q
:
��R S
new
��T W

HttpClient
��X b
(
��b c
)
��c d
;
��d e
client
�� 
.
�� #
DefaultRequestHeaders
�� ,
.
��, -
Authorization
��- :
=
��; <
new
��= @'
AuthenticationHeaderValue
��A Z
(
��Z [
$str
��[ c
,
��c d
authorsList
��e p
[
��p q
$num
��q r
]
��r s
)
��s t
;
��t u
var
�� 
	urlstring
�� 
=
�� 
reportApiURL
��  ,
+
��- .
$str
��/ ;
+
��< =
reportmaster
��> J
.
��J K
fileName
��K S
+
��T U
$str
��V i
+
��j k
reportmaster
��l x
.
��x y
isEndUserReport��y �
+��� �
$str��� �
+��� �
reportmaster��� �
.��� �$
reportGenerationType��� �
;��� �
var
�� 
response
�� 
=
�� 
await
�� $
client
��% +
.
��+ ,
GetAsync
��, 4
(
��4 5
	urlstring
��5 >
)
��> ?
;
��? @
response
�� 
.
�� %
EnsureSuccessStatusCode
�� 0
(
��0 1
)
��1 2
;
��2 3
var
�� !
responseModelString
�� '
=
��( )
await
��* /
response
��0 8
.
��8 9
Content
��9 @
.
��@ A
ReadAsStringAsync
��A R
(
��R S
)
��S T
;
��T U
var
�� 
responseModel
�� !
=
��" #
(
��$ %
ResponseModel
��% 2
)
��2 3
(
��3 4
(
��4 5

Newtonsoft
��5 ?
.
��? @
Json
��@ D
.
��D E
Linq
��E I
.
��I J
JObject
��J Q
)
��Q R

Newtonsoft
��R \
.
��\ ]
Json
��] a
.
��a b
JsonConvert
��b m
.
��m n
DeserializeObject
��n 
(�� �#
responseModelString��� �
)��� �
)��� �
.��� �
ToObject
��  
(
��  !
typeof
��! '
(
��' (
ResponseModel
��( 5
)
��5 6
)
��6 7
;
��7 8
if
�� 
(
�� 
responseModel
�� !
.
��! "
	IsSuccess
��" +
==
��, .
false
��/ 4
||
��5 7
(
��8 9
bool
��9 =
)
��= >
responseModel
��> K
.
��K L
Model
��L Q
==
��R T
false
��U Z
)
��Z [
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
var
�� 
somethingWrongMSG
�� )
=
��* +
await
��, 1$
_dynamicMessageService
��2 H
.
��H I
Get
��I L
(
��L M
SOMTHING_WRONG
��M [
)
��[ \
;
��\ ]
ApiResponse
�� 
apiResponse
��  +
=
��, -
new
��. 1
ApiResponse
��2 =
(
��= >
)
��> ?
{
�� 
userMessage
�� #
=
��$ %
new
��& )
UserMessage
��* 5
{
��6 7
messageContent
��8 F
=
��G H
new
��I L
MessageContent
��M [
{
��\ ]
messageType
��^ i
=
��j k
responseModel
��l y
.
��y z
	IsSuccess��z �
?��� �
notFoundMSG��� �
.��� �
messageType��� �
:��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
responseModel��� �
.��� �
	IsSuccess��� �
?��� �
notFoundMSG��� �
.��� �
messageCode��� �
:��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
responseModel��� �
.��� �
	IsSuccess��� �
?��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �
$str��� �
)��� �
:��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
}
�� 
;
�� 
return
�� 

StatusCode
�� %
(
��% &
responseModel
��& 3
.
��3 4
	IsSuccess
��4 =
?
��> ?
$num
��@ C
:
��D E
$num
��F I
,
��I J
apiResponse
��K V
)
��V W
;
��W X
}
�� 
var
�� 
getByteDataURL
�� "
=
��# $
_constantPath
��% 2
.
��2 3
ReportApiURL
��3 ?
+
��@ A"
GET_REPORT_BYTE_DATA
��B V
;
��V W
	urlstring
�� 
=
�� 
getByteDataURL
�� *
+
��+ ,
$str
��- 9
+
��: ;
reportmaster
��< H
.
��H I
fileName
��I Q
+
��R S
$str
��T g
+
��h i
reportmaster
��j v
.
��v w
isEndUserReport��w �
+��� �
$str��� �
+��� �
reportmaster��� �
.��� �$
reportGenerationType��� �
;��� �
response
�� 
=
�� 
await
��  
client
��! '
.
��' (
GetAsync
��( 0
(
��0 1
	urlstring
��1 :
)
��: ;
;
��; <
response
�� 
.
�� %
EnsureSuccessStatusCode
�� 0
(
��0 1
)
��1 2
;
��2 3!
responseModelString
�� #
=
��$ %
await
��& +
response
��, 4
.
��4 5
Content
��5 <
.
��< =
ReadAsStringAsync
��= N
(
��N O
)
��O P
;
��P Q
responseModel
�� 
=
�� 
(
��  !
ResponseModel
��! .
)
��. /
(
��/ 0
(
��0 1

Newtonsoft
��1 ;
.
��; <
Json
��< @
.
��@ A
Linq
��A E
.
��E F
JObject
��F M
)
��M N

Newtonsoft
��N X
.
��X Y
Json
��Y ]
.
��] ^
JsonConvert
��^ i
.
��i j
DeserializeObject
��j {
(
��{ |"
responseModelString��| �
)��� �
)��� �
.��� �
ToObject
��  
(
��  !
typeof
��! '
(
��' (
ResponseModel
��( 5
)
��5 6
)
��6 7
;
��7 8
if
�� 
(
�� 
responseModel
�� !
.
��! "
	IsSuccess
��" +
==
��, .
false
��/ 4
)
��4 5
{
�� 
ApiResponse
�� 
apiResponse
��  +
=
��, -
new
��. 1
ApiResponse
��2 =
(
��= >
)
��> ?
{
�� 
userMessage
�� #
=
��$ %
new
��& )
UserMessage
��* 5
{
��6 7
message
��8 ?
=
��@ A
responseModel
��B O
.
��O P
Message
��P W
}
��X Y
}
�� 
;
�� 
return
�� 

StatusCode
�� %
(
��% &
responseModel
��& 3
.
��3 4

StatusCode
��4 >
,
��> ?
apiResponse
��@ K
)
��K L
;
��L M
}
�� 
ReportByteDataVM
��  
reportByteDataVM
��! 1
=
��2 3
(
��4 5
ReportByteDataVM
��5 E
)
��E F
(
��F G
(
��G H

Newtonsoft
��H R
.
��R S
Json
��S W
.
��W X
Linq
��X \
.
��\ ]
JObject
��] d
)
��d e

Newtonsoft
��e o
.
��o p
Json
��p t
.
��t u
JsonConvert��u �
.��� �!
DeserializeObject��� �
(��� �
responseModel��� �
.��� �
Model��� �
.��� �
ToString��� �
(��� �
)��� �
)��� �
)��� �
.��� �
ToObject
��  
(
��  !
typeof
��! '
(
��' (
ReportByteDataVM
��( 8
)
��8 9
)
��9 :
;
��: ;
var
�� 
reportByteData
�� "
=
��# $
reportByteDataVM
��% 5
.
��5 6
ReportByteData
��6 D
;
��D E
var
�� 
companyInfo
�� 
=
��  !
await
��" '
_FJTSqlDBContext
��( 8
.
��8 9
CompanyInfos
��9 E
.
��E F
Include
��F M
(
��M N
x
��N O
=>
��P R
x
��S T
.
��T U

Mfgcodemst
��U _
)
��_ `
.
��` a
Select
��a g
(
��g h
x
��h i
=>
��j l
new
��m p
{
��q r
x
��s t
.
��t u

Mfgcodemst
��u 
.�� �
mfgCode��� �
}��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
var
�� 
report
�� 
=
�� 
new
��  
	StiReport
��! *
(
��* +
)
��+ ,
;
��, -
report
�� 
.
�� 
Load
�� 
(
�� 
reportByteData
�� *
)
��* +
;
��+ ,
report
�� 
.
�� 

ReportName
�� !
=
��" ##
reportviewerparameter
��$ 9
.
��9 :

reportName
��: D
!=
��E G
null
��H L
?
��M N
companyInfo
��O Z
.
��Z [
mfgCode
��[ b
+
��c d#
reportviewerparameter
��e z
.
��z {

reportName��{ �
:��� �
reportmaster��� �
.��� �

reportName��� �
;��� �
StiDictionary
�� 

dictionary
�� (
=
��) *
report
��+ 1
.
��1 2

Dictionary
��2 <
;
��< =
var
�� 
dbList
�� 
=
�� 

dictionary
�� '
.
��' (
	Databases
��( 1
.
��1 2
ToList
��2 8
(
��8 9
)
��9 :
;
��: ;
for
�� 
(
�� 
int
�� 
i
�� 
=
�� 
$num
�� 
;
�� 
i
��  !
<
��" #
dbList
��$ *
.
��* +
Count
��+ 0
;
��0 1
i
��2 3
++
��3 5
)
��5 6
{
�� 
(
�� 
(
�� 
StiSqlDatabase
�� $
)
��$ %

dictionary
��% /
.
��/ 0
	Databases
��0 9
[
��9 :
i
��: ;
]
��; <
)
��< =
.
��= >
ConnectionString
��> N
=
��O P 
_connectionStrings
��Q c
.
��c d
ReportConnection
��d t
;
��t u
}
�� 
var
�� 
variableList
��  
=
��! "

dictionary
��# -
.
��- .
	Variables
��. 7
.
��7 8
ToList
��8 >
(
��> ?
)
��? @
;
��@ A
foreach
�� 
(
�� 
var
�� 
item
�� !
in
��" $
variableList
��% 1
)
��1 2
{
�� 
item
�� 
.
�� 
Value
�� 
=
��  
null
��! %
;
��% &
}
�� 
foreach
�� 
(
�� 
var
�� 
variableName
�� )
in
��* ,
Enum
��- 1
.
��1 2
GetNames
��2 :
(
��: ;
typeof
��; A
(
��A B$
ConstantReportVariable
��B X
)
��X Y
)
��Y Z
)
��Z [
{
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� .
(
��. /
variableName
��/ ;
)
��; <
)
��< =
{
�� $
ConstantReportVariable
�� .
reportVariable
��/ =
=
��> ?
(
��@ A$
ConstantReportVariable
��A W
)
��W X
Enum
��X \
.
��\ ]
Parse
��] b
(
��b c
typeof
��c i
(
��i j%
ConstantReportVariable��j �
)��� �
,��� �
variableName��� �
)��� �
;��� �

dictionary
�� "
.
��" #
	Variables
��# ,
[
��, -
variableName
��- 9
]
��9 :
.
��: ;
Value
��; @
=
��A B
reportVariable
��C Q
.
��Q R
GetDisplayValue
��R a
(
��a b
)
��b c
;
��c d
}
�� 
}
�� 
FilterParameters
��  
filterParameters
��! 1
=
��2 3
(
��4 5
FilterParameters
��5 E
)
��E F
(
��F G
(
��G H

Newtonsoft
��H R
.
��R S
Json
��S W
.
��W X
Linq
��X \
.
��\ ]
JObject
��] d
)
��d e

Newtonsoft
��e o
.
��o p
Json
��p t
.
��t u
JsonConvert��u �
.��� �!
DeserializeObject��� �
(��� �%
reportviewerparameter��� �
.��� �
parameterValues��� �
)��� �
)��� �
.��� �
ToObject
��< D
(
��D E
typeof
��E K
(
��K L
FilterParameters
��L \
)
��\ ]
)
��] ^
;
��^ _
PropertyInfo
�� 
[
�� 
]
�� (
filterParametersProperties
�� 9
=
��: ;
filterParameters
��< L
.
��L M
GetType
��M T
(
��T U
)
��U V
.
��V W
GetProperties
��W d
(
��d e
)
��e f
;
��f g
var
�� '
reportmasterparameterList
�� -
=
��. /
await
��0 5
_FJTSqlDBContext
��6 F
.
��F G#
reportmasterparameter
��G \
.
��\ ]
Where
��] b
(
��b c
x
��c d
=>
��e g
x
��h i
.
��i j
reportId
��j r
==
��s u
reportmaster��v �
.��� �
id��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �!
parmeterMappingid��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
var
��  
param_DbColumnList
�� &
=
��' (
await
��) .
_FJTSqlDBContext
��/ ?
.
��? @.
 report_parameter_setting_mapping
��@ `
.
��` a
Where
��a f
(
��f g
x
��g h
=>
��i k(
reportmasterparameterList��l �
.��� �
Any��� �
(��� �
paramId��� �
=>��� �
x��� �
.��� �
id��� �
==��� �
paramId��� �
)��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
new��� �
{��� �
x��� �
.��� �
reportParamName��� �
,��� �
x��� �
.��� �
dbColumnName��� �
}��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
foreach
�� 
(
�� 
var
�� 
item
�� !
in
��" $ 
param_DbColumnList
��% 7
)
��7 8
{
�� 
var
�� 
valueObj
��  
=
��! "(
filterParametersProperties
��# =
.
��= >
Where
��> C
(
��C D
x
��D E
=>
��F H
x
��I J
.
��J K
Name
��K O
==
��P R
item
��S W
.
��W X
dbColumnName
��X d
)
��d e
.
��e f
Select
��f l
(
��l m
x
��m n
=>
��o q
x
��r s
.
��s t
GetValue
��t |
(
��| }
filterParameters��} �
)��� �
)��� �
.��� �
FirstOrDefault��� �
(��� �
)��� �
;��� �
var
�� 

paramValue
�� "
=
��# $
string
��% +
.
��+ ,
Empty
��, 1
;
��1 2
if
�� 
(
�� 
valueObj
��  
!=
��! #
null
��$ (
)
��( )
{
�� 

paramValue
�� "
=
��# $
valueObj
��% -
.
��- .
ToString
��. 6
(
��6 7
)
��7 8
;
��8 9
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� .
(
��. /
item
��/ 3
.
��3 4
reportParamName
��4 C
)
��C D
)
��D E
{
�� 

dictionary
�� "
.
��" #
	Variables
��# ,
[
��, -
item
��- 1
.
��1 2
reportParamName
��2 A
]
��A B
.
��B C
Value
��C H
=
��I J

paramValue
��K U
;
��U V
}
�� 
else
�� 
{
�� 

dictionary
�� "
.
��" #
	Variables
��# ,
.
��, -
Add
��- 0
(
��0 1
$str
��1 3
,
��3 4
item
��5 9
.
��9 :
reportParamName
��: I
,
��I J
item
��K O
.
��O P
dbColumnName
��P \
,
��\ ]

paramValue
��^ h
)
��h i
;
��i j
}
�� 
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� *
(
��* +
PARA_REPORT_TITLE
��+ <
)
��< =
)
��= >
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )
PARA_REPORT_TITLE
��) :
]
��: ;
.
��; <
Value
��< A
=
��B C
reportmaster
��D P
.
��P Q
reportTitle
��Q \
;
��\ ]
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� *
(
��* +!
PARA_REPORT_VERSION
��+ >
)
��> ?
)
��? @
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )!
PARA_REPORT_VERSION
��) <
]
��< =
.
��= >
Value
��> C
=
��D E
reportmaster
��F R
.
��R S
reportVersion
��S `
??
��a c
$str
��d g
;
��g h
}
�� 
if
�� 
(
�� 
report
�� 
.
�� 
IsVariableExist
�� *
(
��* +'
Para_ROHS_ImageFolderPath
��+ D
)
��D E
)
��E F
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )'
Para_ROHS_ImageFolderPath
��) B
]
��B C
.
��C D
Value
��D I
=
��J K
string
��L R
.
��R S
Concat
��S Y
(
��Y Z
_constantPath
��Z g
.
��g h
APIURL
��h n
,
��n o
_constantPath
��p }
.
��} ~
RoHSImagesPath��~ �
)��� �
;��� �
}
�� 
return
�� &
StiNetCoreReportResponse
�� /
.
��/ 0
ResponseAsPdf
��0 =
(
��= >
report
��> D
)
��D E
;
��E F
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
var
�� 
somethingWrongMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
SOMTHING_WRONG
��I W
)
��W X
;
��X Y
ApiResponse
�� 
response
�� $
=
��% &
new
��' *
ApiResponse
��+ 6
(
��6 7
)
��7 8
{
�� 
userMessage
�� 
=
��  !
new
��" %
UserMessage
��& 1
{
��2 3
messageContent
��4 B
=
��C D
new
��E H
MessageContent
��I W
{
��X Y
messageType
��Z e
=
��f g
somethingWrongMSG
��h y
.
��y z
messageType��z �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
,��� �
err��� �
=��� �
new��� �
ErrorVM��� �
{��� �
message��� �
=��� �
e��� �
.��� �
Message��� �
,��� �
stack��� �
=��� �
e��� �
.��� �

StackTrace��� �
}��� �
}��� �
}��� �
}
�� 
;
�� 
return
�� 

StatusCode
�� !
(
��! "
(
��" #
int
��# &
)
��& '
APIStatusCode
��' 4
.
��4 5#
INTERNAL_SERVER_ERROR
��5 J
,
��J K
response
��L T
)
��T U
;
��U V
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' ('
SaveReportViewerParameter
��) B
(
��B C
[
��C D
FromBody
��D L
]
��L M&
RequestFilterParameterVM
��N f%
reportviewerparameterVM
��g ~
)
��~ 
{
�� 	
if
�� 
(
�� %
reportviewerparameterVM
�� '
==
��( *
null
��+ /
||
��0 2%
reportviewerparameterVM
��3 J
.
��J K
id
��K M
==
��N P
$num
��Q R
)
��R S
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� #
reportviewerparameter
�� %#
reportviewerparameter
��& ;
=
��< =
new
��> A#
reportviewerparameter
��B W
{
�� 
parameterGUID
�� !
=
��" #
Guid
��$ (
.
��( )
NewGuid
��) 0
(
��0 1
)
��1 2
,
��2 3
reportId
�� 
=
�� %
reportviewerparameterVM
�� 6
.
��6 7
id
��7 9
,
��9 :

reportName
�� 
=
��  %
reportviewerparameterVM
��! 8
.
��8 9

reportName
��9 C
,
��C D
parameterValues
�� #
=
��$ %%
reportviewerparameterVM
��& =
.
��= > 
parameterValueJson
��> P
,
��P Q
	createdBy
�� 
=
�� %
reportviewerparameterVM
��  7
.
��7 8
	createdBy
��8 A
,
��A B
	updatedBy
�� 
=
�� %
reportviewerparameterVM
��  7
.
��7 8
	updatedBy
��8 A
,
��A B
	createdAt
�� 
=
�� 
StaticMethods
��  -
.
��- .
GetUtcDateTime
��. <
(
��< =
)
��= >
,
��> ?
	updatedAt
�� 
=
�� 
StaticMethods
��  -
.
��- .
GetUtcDateTime
��. <
(
��< =
)
��= >
,
��> ?
createByRoleId
�� "
=
��# $%
reportviewerparameterVM
��% <
.
��< =
createByRoleId
��= K
,
��K L
updateByRoleId
�� "
=
��# $%
reportviewerparameterVM
��% <
.
��< =
updateByRoleId
��= K
,
��K L
deleteByRoleId
�� "
=
��# $%
reportviewerparameterVM
��% <
.
��< =
deleteByRoleId
��= K
}
�� 
;
�� 
_FJTSqlDBContext
��  
.
��  !#
reportviewerparameter
��! 6
.
��6 7
Add
��7 :
(
��: ;#
reportviewerparameter
��; P
)
��P Q
;
��Q R
await
�� 
_FJTSqlDBContext
�� &
.
��& '
SaveChangesAsync
��' 7
(
��7 8
)
��8 9
;
��9 :
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f#
reportviewerparameter
��g |
.
��| }
parameterGUID��} �
,��� �
null��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
Error
��) .
(
��. /
)
��/ 0
{
�� 	
var
�� 
somethingWrongMSG
�� !
=
��" #
await
��$ )$
_dynamicMessageService
��* @
.
��@ A
Get
��A D
(
��D E
SOMTHING_WRONG
��E S
)
��S T
;
��T U
return
�� 
View
�� 
(
�� 
new
�� 
ErrorViewModel
�� *
{
��+ ,

StatusCode
��- 7
=
��8 9
(
��: ;
int
��; >
)
��> ?
APIStatusCode
��? L
.
��L M#
INTERNAL_SERVER_ERROR
��M b
,
��b c
Message
��d k
=
��l m
somethingWrongMSG
��n 
.�� �
message��� �
}��� �
)��� �
;��� �
}
�� 	
}
�� 
}�� �
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
$str	 �
)
� �
]
� �,
 Para_DeclarationOfRoHSCompliance (
,( )
[ 	
Display	 
( 
Name 
= 
$str	 �
)
� �
]
� �%
Para_COFCReportDisclaimer !
,! "
[ 	
Display	 
( 
Name 
= 
$str	 �
)
� �
]
� �,
 Para_PACKINGSLIPReportDisclaimer (
,( )
[ 	
Display	 
( 
Name 
= 
$str	 �
)
� �
]
� �%
Para_RoHSReportDisclaimer !
} 
} �
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
} �
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
} �
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
;	99 �
public;; 
const;; 
string;; $
MONGODB_CONNECTION_ERROR;; 4
=;;5 6
$str	;;7 �
;
;;� �
}<< 
}== � 
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
};; �	
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
}&& �
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
}   �
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
} �
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
} �"
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
}$$ �
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
} �
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
}&& �
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
} �:
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
}`` � 
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
}:: � 
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
}@@ �
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
} �*
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
}11 �l
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
�� 	
StringLength
��	 
(
�� 
$num
�� 
)
�� 
]
�� 
public
�� 
string
�� 
customerSystemID
�� &
{
��' (
get
��) ,
;
��, -
set
��. 1
;
��1 2
}
��3 4
public
�� 
bool
�� 
?
�� /
!invoicesRequireManagementApproval
�� 6
{
��7 8
get
��9 <
;
��< =
set
��> A
;
��A B
}
��C D
public
�� 
int
�� 
?
�� 
acctId
�� 
{
�� 
get
��  
;
��  !
set
��" %
;
��% &
}
��' (
public
�� 
DateTime
�� 
unqDate
�� 
{
��  !
get
��" %
;
��% &
set
��' *
;
��* +
}
��, -
public
�� 
bool
�� 
isSupplierEnable
�� $
{
��% &
get
��' *
;
��* +
set
��, /
;
��/ 0
}
��1 2
public
�� 
decimal
�� 
?
�� #
externalSupplierOrder
�� -
{
��. /
get
��0 3
;
��3 4
set
��5 8
;
��8 9
}
��: ;
public
�� 
bool
�� 
?
�� 
	isDeleted
�� 
{
��  
get
��! $
;
��$ %
set
��& )
;
��) *
}
��+ ,
[
�� 	
StringLength
��	 
(
�� 
$num
�� 
)
�� 
]
�� 
public
�� 
string
�� 
	createdBy
�� 
{
��  !
get
��" %
;
��% &
set
��' *
;
��* +
}
��, -
[
�� 	
StringLength
��	 
(
�� 
$num
�� 
)
�� 
]
�� 
public
�� 
string
�� 
	updatedBy
�� 
{
��  !
get
��" %
;
��% &
set
��' *
;
��* +
}
��, -
[
�� 	
StringLength
��	 
(
�� 
$num
�� 
)
�� 
]
�� 
public
�� 
string
�� 
	deletedBy
�� 
{
��  !
get
��" %
;
��% &
set
��' *
;
��* +
}
��, -
public
�� 
DateTime
�� 
	createdAt
�� !
{
��" #
get
��$ '
;
��' (
set
��) ,
;
��, -
}
��. /
public
�� 
DateTime
�� 
?
�� 
	updatedAt
�� "
{
��# $
get
��% (
;
��( )
set
��* -
;
��- .
}
��/ 0
public
�� 
DateTime
�� 
?
�� 
	deletedAt
�� "
{
��# $
get
��% (
;
��( )
set
��* -
;
��- .
}
��/ 0
public
�� 
int
�� 
?
�� 
createByRoleId
�� "
{
��# $
get
��% (
;
��( )
set
��* -
;
��- .
}
��/ 0
public
�� 
int
�� 
?
�� 
updateByRoleId
�� "
{
��# $
get
��% (
;
��( )
set
��* -
;
��- .
}
��/ 0
public
�� 
int
�� 
?
�� 
deleteByRoleId
�� "
{
��# $
get
��% (
;
��( )
set
��* -
;
��- .
}
��/ 0
}
�� 
}�� �e
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
�� 
string
�� 
draftFileName
�� #
{
��$ %
get
��& )
;
��) *
set
��+ .
;
��. /
}
��0 1
public
�� 
int
�� 
?
�� 
radioButtonFilter
�� %
{
��& '
get
��( +
;
��+ ,
set
��- 0
;
��0 1
}
��2 3
public
�� 
string
�� 
additionalNotes
�� %
{
��& '
get
��( +
;
��+ ,
set
��- 0
;
��0 1
}
��2 3
public
�� 
bool
�� 
isCSVReport
�� 
{
��  !
get
��" %
;
��% &
set
��' *
;
��* +
}
��, -
public
�� 
string
�� 
csvReportAPI
�� "
{
��# $
get
��% (
;
��( )
set
��* -
;
��- .
}
��/ 0
public
�� 
int
�� 
?
�� 
refReportId
�� 
{
��  !
get
��" %
;
��% &
set
��' *
;
��* +
}
��, -
[
�� 	
StringLength
��	 
(
�� 
$num
�� 
)
�� 
]
�� 
public
�� 
string
�� 
status
�� 
{
�� 
get
�� "
;
��" #
set
��$ '
;
��' (
}
��) *
public
�� 
int
�� 
?
�� 
entityId
�� 
{
�� 
get
�� "
;
��" #
set
��$ '
;
��' (
}
��) *
public
�� 
int
�� 
?
�� 
	editingBy
�� 
{
�� 
get
��  #
;
��# $
set
��% (
;
��( )
}
��* +
public
�� 
DateTime
�� 
?
��  
startDesigningDate
�� +
{
��, -
get
��. 1
;
��1 2
set
��3 6
;
��6 7
}
��8 9
public
�� 
string
�� "
reportGenerationType
�� *
{
��+ ,
get
��- 0
;
��0 1
set
��2 5
;
��5 6
}
��7 8
[
�� 	
StringLength
��	 
(
�� 
$num
�� 
)
�� 
]
�� 
public
�� 
string
�� 
reportVersion
�� #
{
��$ %
get
��& )
;
��) *
set
��+ .
;
��. /
}
��0 1
public
�� 
bool
�� 
isDefaultReport
�� #
{
��$ %
get
��& )
;
��) *
set
��+ .
;
��. /
}
��0 1
[
�� 	

ForeignKey
��	 
(
�� 
$str
�� 
)
�� 
]
��  
public
�� 
virtual
�� 
entity
�� 
entity
�� $
{
��% &
get
��' *
;
��* +
set
��, /
;
��/ 0
}
��1 2
[
�� 	

ForeignKey
��	 
(
�� 
$str
�� &
)
��& '
]
��' (
public
�� 
virtual
�� 
genericcategory
�� &
genericcategory
��' 6
{
��7 8
get
��9 <
;
��< =
set
��> A
;
��A B
}
��C D
}
�� 
}�� �
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
}22 �
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
}00 �
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
}11 �&
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
}BB �"
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
}<< �
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
}00 �
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
DynamicMessage	!!~ �
{
!!� �
messageType
!!� �
=
!!� �
$str
!!� �
,
!!� �
message
!!� �
=
!!� �
ConstantHelper
!!� �
.
!!� �&
MONGODB_CONNECTION_ERROR
!!� �
}
!!� �
;
!!� �
}"" 
}## �0
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
)	 �
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
messageType	''v �
,
''� �
messageCode
''� �
=
''� �
somethingWrongMSG
''� �
.
''� �
messageCode
''� �
,
''� �
message
''� �
=
''� �
somethingWrongMSG
''� �
.
''� �
message
''� �
,
''� �
err
''� �
=
''� �
new
''� �
ErrorVM
''� �
{
''� �
message
''� �
=
''� �
e
''� �
.
''� �
Message
''� �
,
''� �
stack
''� �
=
''� �
e
''� �
.
''� �

StackTrace
''� �
}
''� �
}
''� �
}
''� �
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
}HH �
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
} �
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
} �
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
} �

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
} ��
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
(	77 � 
mySqlConnectionStr
77� �
)
77� �
)
77� �
)
77� �
;
77� �
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
delegate	QQ} �
{
QQ� �
return
QQ� �
true
QQ� �
;
QQ� �
}
QQ� �
}
QQ� �
;
QQ� �
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
delegate	ll} �
{
ll� �
return
ll� �
true
ll� �
;
ll� �
}
ll� �
}
ll� �
;
ll� �
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
�� 
OnTokenValidated
�� (
=
��) *
x
��+ ,
=>
��- /
{
�� 
var
�� 
identity
��  (
=
��) *
(
��+ ,
ClaimsIdentity
��, :
)
��: ;
x
��; <
.
��< =
	Principal
��= F
.
��F G
Identity
��G O
;
��O P
identity
�� $
.
��$ %
	AddClaims
��% .
(
��. /
new
��/ 2
[
��2 3
]
��3 4
{
�� 
new
��  #
Claim
��$ )
(
��) *
$str
��* 8
,
��8 9
x
��: ;
.
��; <#
TokenEndpointResponse
��< Q
.
��Q R
AccessToken
��R ]
)
��] ^
,
��^ _
new
��  #
Claim
��$ )
(
��) *
$str
��* 9
,
��9 :
x
��; <
.
��< =#
TokenEndpointResponse
��= R
.
��R S
RefreshToken
��S _
)
��_ `
}
�� 
)
�� 
;
�� 
x
�� 
.
�� 

Properties
�� (
.
��( )
IsPersistent
��) 5
=
��6 7
true
��8 <
;
��< =
return
�� "
Task
��# '
.
��' (
CompletedTask
��( 5
;
��5 6
}
�� 
}
�� 
;
�� 
}
�� 
)
�� 
;
�� 
}
�� 	
public
�� 
void
�� 
	Configure
�� 
(
�� !
IApplicationBuilder
�� 1
app
��2 5
,
��5 6!
IWebHostEnvironment
��7 J
env
��K N
)
��N O
{
�� 	
app
�� 
.
�� 
UseCors
�� 
(
�� 
$str
�� $
)
��$ %
;
��% &
if
�� 
(
�� 
env
�� 
.
�� 
IsDevelopment
�� !
(
��! "
)
��" #
)
��# $
{
�� 
app
�� 
.
�� '
UseDeveloperExceptionPage
�� -
(
��- .
)
��. /
;
��/ 0
}
�� 
else
�� 
{
�� 
app
�� 
.
�� !
UseExceptionHandler
�� '
(
��' (
$str
��( 7
)
��7 8
;
��8 9
app
�� 
.
�� 
UseHsts
�� 
(
�� 
)
�� 
;
�� 
}
�� 
app
�� 
.
�� !
UseHttpsRedirection
�� #
(
��# $
)
��$ %
;
��% &
app
�� 
.
�� 
UseStaticFiles
�� 
(
�� 
)
��  
;
��  !
app
�� 
.
�� 

UseSession
�� 
(
�� 
)
�� 
;
�� 
app
�� 
.
�� $
UseRequestLocalization
�� &
(
��& '
)
��' (
;
��( )
app
�� 
.
�� 

UseRouting
�� 
(
�� 
)
�� 
;
�� 
app
�� 
.
�� 
UseAuthentication
�� !
(
��! "
)
��" #
;
��# $
app
�� 
.
�� 
UseAuthorization
��  
(
��  !
)
��! "
;
��" #
app
�� 
.
�� 
UseEndpoints
�� 
(
�� 
	endpoints
�� &
=>
��' )
{
�� 
	endpoints
�� 
.
��  
MapControllerRoute
�� ,
(
��, -
name
�� 
:
�� 
$str
�� #
,
��# $
pattern
�� 
:
�� 
$str
�� G
)
��G H
;
��H I
}
�� 
)
�� 
;
�� 
}
�� 	
}
�� 
}�� 
�
ND:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\ConnectionStrings.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
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
} �
ID:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\ConstantPath.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
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
 

ReportPath
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
public 
string 
TemplateReportPath (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string %
SystemGeneratedReportPath /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
public 
string 
	UiPageUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
IdentityserverURL '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
APIURL 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
RoHSImagesPath $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} �
QD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\IdentityserverConfig.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
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
JD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\AppSettings\MongoDBConfig.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
AppSettings (
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
} �
PD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\AuthorizeController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
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
public 
async 
Task 
< 
IActionResult '
>' (
NotFound) 1
(1 2
)2 3
{ 	
var   
notFoundMSG   
=   
await   #"
_dynamicMessageService  $ :
.  : ;
Get  ; >
(  > ?
	NOT_FOUND  ? H
)  H I
;  I J
return!! 
View!! 
(!! 
$str!! 
,!!  
new!!! $
ErrorViewModel!!% 3
{!!4 5

StatusCode!!6 @
=!!A B
(!!C D
int!!D G
)!!G H
APIStatusCode!!H U
.!!U V
PAGE_NOT_FOUND!!V d
,!!d e
Message!!f m
=!!n o
string!!p v
.!!v w
Format!!w }
(!!} ~
notFoundMSG	!!~ �
.
!!� �
message
!!� �
,
!!� �
REQUESTED_PAGE
!!� �
)
!!� �
}
!!� �
)
!!� �
;
!!� �
}"" 	
public## 
IActionResult## 
Error## "
(##" #
ErrorViewModel### 1
errorViewModel##2 @
)##@ A
{$$ 	
return%% 
View%% 
(%% 
$str%% 
,%%  
errorViewModel%%! /
)%%/ 0
;%%0 1
}&& 	
}'' 
}(( �
KD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\BaseController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
public 

class 
BaseController 
:  !

Controller" ,
{ 
	protected 
readonly 
FJTSqlDBContext *
_FJTSqlDBContext+ ;
;; <
	protected 
ConstantPath 
_constantPath ,
;, -
public 
BaseController 
( 
FJTSqlDBContext -
fjtSqlDBContext. =
,= >
IOptions? G
<G H
ConstantPathH T
>T U
constantPathV b
)b c
{ 	
_FJTSqlDBContext 
= 
fjtSqlDBContext .
;. /
_constantPath 
= 
constantPath (
.( )
Value) .
;. /
} 	
	protected 
string 
	GetUserId "
(" #
)# $
{ 	
try 
{   
var!! 
userid!! 
=!! 
string!! #
.!!# $
Empty!!$ )
;!!) *
var"" 
identityUserId"" "
=""# $
HttpContext""% 0
.""0 1
User""1 5
.""5 6
Claims""6 <
.""< =
Count""= B
(""B C
)""C D
!=""E G
$num""H I
?""J K
HttpContext""L W
.""W X
User""X \
.""\ ]
	FindFirst""] f
(""f g

ClaimTypes""g q
.""q r
NameIdentifier	""r �
)
""� �
.
""� �
Value
""� �
:
""� �
null
""� �
;
""� �
if## 
(## 
identityUserId## "
!=### %
null##& *
)##* +
{$$ 
userid%% 
=%% 
_FJTSqlDBContext%% -
.%%- .
users%%. 3
.%%3 4
Where%%4 9
(%%9 :
x%%: ;
=>%%< >
x%%? @
.%%@ A
IdentityUserId%%A O
==%%P R
identityUserId%%S a
)%%a b
.%%b c
Select%%c i
(%%i j
x%%j k
=>%%l n
x%%o p
.%%p q
id%%q s
)%%s t
.%%t u
FirstOrDefault	%%u �
(
%%� �
)
%%� �
.
%%� �
ToString
%%� �
(
%%� �
)
%%� �
;
%%� �
}&& 
return'' 
userid'' 
;'' 
}(( 
catch)) 
{** 
return++ 
string++ 
.++ 
Empty++ #
;++# $
},, 
}-- 	
	protected.. 
string.. 
GetUserNameById.. (
(..( )
int..) ,
?.., -
id... 0
)..0 1
{// 	
var00 
user00 
=00 
_FJTSqlDBContext00 '
.00' (
users00( -
.00- .
Find00. 2
(002 3
id003 5
)005 6
;006 7
return11 
user11 
!=11 
null11 
?11  !
user11" &
.11& '
username11' /
:110 1
string112 8
.118 9
Empty119 >
;11> ?
}22 	
}33 
}44 �
]D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\CheckApplicationStatusController.cs
	namespace		 	
FJT		
 
.		 
ReportDesigner		 
.		 
Controllers		 (
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
} ۃ
YD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\CustomAuthorizationAttribute.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
public 

class (
CustomAuthorizationAttribute -
:. /!
ActionFilterAttribute0 E
{ 
public 
override 
void 
OnActionExecuted -
(- .!
ActionExecutedContext. C
filterContextD Q
)Q R
{ 	
CustomClaim 
( 
$str *
,* +
filterContext, 9
.9 :
	RouteData: C
)C D
;D E
} 	
public 
override 
async 
Task ""
OnActionExecutionAsync# 9
(9 :"
ActionExecutingContext: P
filterContextQ ^
,^ _#
ActionExecutionDelegate` w
nextx |
)| }
{ 	
var   
accessToken   
=   
await   #
filterContext  $ 1
.  1 2
HttpContext  2 =
.  = >
GetTokenAsync  > K
(  K L
$str  L Z
)  Z [
;  [ \
bool!! 
	isApiCall!! 
=!! 
false!! "
;!!" #
if## 
(## 
accessToken## 
==## 
null## #
)### $
{$$ 
var%% 
urlPath%% 
=%% 
string%% $
.%%$ %
Empty%%% *
;%%* +
string'' 
authorizationToken'' )
=''* +
filterContext'', 9
.''9 :
HttpContext'': E
.''E F
Request''F M
.''M N
Headers''N U
[''U V
$str''V e
]''e f
;''f g
if)) 
()) 
filterContext)) !
.))! "
HttpContext))" -
.))- .
Request)). 5
.))5 6
Path))6 :
.)): ;
HasValue)); C
)))C D
{** 
urlPath++ 
=++ 
filterContext++ +
.+++ ,
HttpContext++, 7
.++7 8
Request++8 ?
.++? @
Path++@ D
.++D E
Value++E J
;++J K
if,, 
(,, 
urlPath,, 
.,,  
Contains,,  (
(,,( )
$str,,) .
),,. /
),,/ 0
{-- 
	isApiCall.. !
=.." #
true..$ (
;..( )
}// 
}00 
if22 
(22 
authorizationToken22 &
==22' )
null22* .
)22. /
{33 
filterContext44 !
.44! "
Result44" (
=44) *
new44+ .!
RedirectToRouteResult44/ D
(44D E
new44E H 
RouteValueDictionary44I ]
(44] ^
new44^ a
{55 

controller66 "
=66# $
filterContext66% 2
.662 3
	RouteData663 <
.66< =
Values66= C
[66C D
$str66D P
]66P Q
,66Q R
action77 
=77  
filterContext77! .
.77. /
	RouteData77/ 8
.778 9
Values779 ?
[77? @
$str77@ H
]77H I
,77I J
id88 
=88 
filterContext88 *
.88* +
	RouteData88+ 4
.884 5
Values885 ;
[88; <
$str88< @
]88@ A
}99 
)99 
)99 
;99 
}:: 
else;; 
{<< 
string== 
[== 
]== 
authorsList== (
===) *
authorizationToken==+ =
.=== >
Split==> C
(==C D
$str==D G
)==G H
;==H I
accessToken>> 
=>>  !
authorsList>>" -
[>>- .
$num>>. /
]>>/ 0
;>>0 1
}?? 
}@@ 
ifBB 
(BB 
accessTokenBB 
!=BB 
nullBB #
)BB# $
{CC 
varDD 
userIdDD 
=DD 
filterContextDD *
.DD* +
HttpContextDD+ 6
.DD6 7
UserDD7 ;
.DD; <
ClaimsDD< B
.DDB C
CountDDC H
(DDH I
)DDI J
!=DDK M
$numDDN O
?DDP Q
filterContextDDR _
.DD_ `
HttpContextDD` k
.DDk l
UserDDl p
.DDp q
	FindFirstDDq z
(DDz {

ClaimTypes	DD{ �
.
DD� �
NameIdentifier
DD� �
)
DD� �
.
DD� �
Value
DD� �
:
DD� �
null
DD� �
;
DD� �
HttpClientHandlerGG !
handlerGG" )
=GG* +
newGG, /
HttpClientHandlerGG0 A
{HH 5
)ServerCertificateCustomValidationCallbackII =
=II> ?
(II@ A
httpRequestMessageIIA S
,IIS T
certIIU Y
,IIY Z
cetChainII[ c
,IIc d
policyErrorsIIe q
)IIq r
=>IIs u
{IIv w
returnIIx ~
true	II �
;
II� �
}
II� �
}JJ 
;JJ 

HttpClientLL 
clientLL !
=LL" #
StartupLL$ +
.LL+ ,
islocalhostLL, 7
?LL8 9
newLL: =

HttpClientLL> H
(LLH I
handlerLLI P
)LLP Q
:LLR S
newLLT W

HttpClientLLX b
(LLb c
)LLc d
;LLd e
clientOO 
.OO !
DefaultRequestHeadersOO ,
.OO, -
AuthorizationOO- :
=OO; <
newOO= @%
AuthenticationHeaderValueOOA Z
(OOZ [
$strOO[ c
,OOc d
accessTokenOOe p
)OOp q
;OOq r
varQQ 
	urlstringQQ 
=QQ 
StartupQQ  '
.QQ' (
IdentityServerURLQQ( 9
+QQ: ;
ConstantHelperQQ< J
.QQJ K,
 VALIDATE_CLIENT_USER_MAPPING_URLQQK k
;QQk l
varRR 
objRR 
=RR 
newRR 
{RR 
UserIdRR  &
=RR' (
userIdRR) /
,RR/ 0
ClaimRR1 6
=RR7 8
StartupRR9 @
.RR@ A
ClientIdRRA I
}RRJ K
;RRK L
varTT 
jsonTT 
=TT 
JsonConvertTT &
.TT& '
SerializeObjectTT' 6
(TT6 7
objTT7 :
)TT: ;
;TT; <
StringContentUU 
dataUU "
=UU# $
newUU% (
StringContentUU) 6
(UU6 7
jsonUU7 ;
,UU; <
EncodingUU= E
.UUE F
UTF8UUF J
,UUJ K
$strUUL ^
)UU^ _
;UU_ `
varWW 
responseWW 
=WW 
awaitWW $
clientWW% +
.WW+ ,
	PostAsyncWW, 5
(WW5 6
	urlstringWW6 ?
,WW? @
dataWWA E
)WWE F
;WWF G
varXX 
responseModelStringXX '
=XX( )
awaitXX* /
responseXX0 8
.XX8 9
ContentXX9 @
.XX@ A
ReadAsStringAsyncXXA R
(XXR S
)XXS T
;XXT U
varYY 
apiResponseYY 
=YY  !
(YY" #
ApiResponseYY# .
)YY. /
(YY/ 0
(YY0 1

NewtonsoftYY1 ;
.YY; <
JsonYY< @
.YY@ A
LinqYYA E
.YYE F
JObjectYYF M
)YYM N

NewtonsoftYYN X
.YYX Y
JsonYYY ]
.YY] ^
JsonConvertYY^ i
.YYi j
DeserializeObjectYYj {
(YY{ | 
responseModelString	YY| �
)
YY� �
)
YY� �
.
YY� �
ToObjectZZ  
(ZZ  !
typeofZZ! '
(ZZ' (
ApiResponseZZ( 3
)ZZ3 4
)ZZ4 5
;ZZ5 6
if\\ 
(\\ 
apiResponse\\ 
.\\  
status\\  &
==\\' )
ConstantHelper\\* 8
.\\8 9
APIState\\9 A
.\\A B
SUCCESS\\B I
.\\I J
ToString\\J R
(\\R S
)\\S T
)\\T U
{]] 
if^^ 
(^^ 
apiResponse^^ #
.^^# $
apiStatusCode^^$ 1
==^^2 4
APIStatusCode^^5 B
.^^B C
UNAUTHORIZED^^C O
&&^^P R
!^^S T
	isApiCall^^T ]
)^^] ^
{__ 
filterContext`` %
.``% &
Result``& ,
=``- .
new``/ 2!
RedirectToRouteResult``3 H
(``H I
new``I L 
RouteValueDictionary``M a
(``a b
new``b e
{``f g

controller``h r
=``s t
$str``u }
,``} ~
action	`` �
=
``� �
$str
``� �
}
``� �
)
``� �
)
``� �
;
``� �
}aa 
elsebb 
{cc 
ifdd 
(dd 
!dd 
	isApiCalldd &
)dd& '
{ee 
varff 
lastLoginUserIdff  /
=ff0 1
filterContextff2 ?
.ff? @
HttpContextff@ K
.ffK L
SessionffL S
.ffS T
	GetStringffT ]
(ff] ^
$strff^ o
)ffo p
;ffp q
ifgg 
(gg  
!gg  !
stringgg! '
.gg' (
IsNullOrEmptygg( 5
(gg5 6
lastLoginUserIdgg6 E
)ggE F
&&ggG I
lastLoginUserIdggJ Y
!=ggZ \
userIdgg] c
)ggc d
{hh 
filterContextii  -
.ii- .
HttpContextii. 9
.ii9 :
Sessionii: A
.iiA B
SetInt32iiB J
(iiJ K
$striiK ]
,ii] ^
$numii_ `
)ii` a
;iia b
}jj 
filterContextkk )
.kk) *
HttpContextkk* 5
.kk5 6
Sessionkk6 =
.kk= >
	SetStringkk> G
(kkG H
$strkkH Y
,kkY Z
userIdkk[ a
)kka b
;kkb c
}ll 
CustomClaimnn #
(nn# $
$strnn$ 7
,nn7 8
filterContextnn9 F
.nnF G
	RouteDatannG P
)nnP Q
;nnQ R
awaitoo 
nextoo "
(oo" #
)oo# $
;oo$ %
}pp 
}qq 
elserr 
{ss 
iftt 
(tt 
	isApiCalltt !
)tt! "
{uu 
ifww 
(ww 
apiResponseww '
.ww' (
dataww( ,
!=ww- /
nullww0 4
&&ww5 7
apiResponseww8 C
.wwC D
datawwD H
.wwH I
ToStringwwI Q
(wwQ R
)wwR S
==wwT V
$strwwW h
)wwh i
{xx 
CustomClaimyy '
(yy' (
$stryy( ;
,yy; <
filterContextyy= J
.yyJ K
	RouteDatayyK T
)yyT U
;yyU V
awaitzz !
nextzz" &
(zz& '
)zz' (
;zz( )
}{{ 
else|| 
{}} 
var~~ !
dynamicMessageService~~  5
=~~6 7
(~~8 9"
IDynamicMessageService~~9 O
)~~O P
filterContext~~P ]
.~~] ^
HttpContext~~^ i
.~~i j
RequestServices~~j y
.~~y z

GetService	~~z �
(
~~� �
typeof
~~� �
(
~~� �$
IDynamicMessageService
~~� �
)
~~� �
)
~~� �
;
~~� �
var 
accessDeniedMSG  /
=0 1
await2 7!
dynamicMessageService8 M
.M N
GetN Q
(Q R
POPUP_ACCESS_DENIEDR e
)e f
;f g
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
}�� ��
OD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\DesignerController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ 
CustomAuthorization 
] 
public 

class 
DesignerController #
:$ %
BaseController& 4
{ 
private   
readonly   
ConnectionStrings   *
_connectionStrings  + =
;  = >
private!! 
readonly!! $
IHttpsResponseRepository!! 1%
_iHttpsResponseRepository!!2 K
;!!K L
private"" 
readonly"" 
ILogger""  
<""  !
DesignerController""! 3
>""3 4
_logger""5 <
;""< =
private## 
readonly## 
IUtilityController## +
_utilityController##, >
;##> ?
private$$ 
readonly$$ "
IDynamicMessageService$$ /"
_dynamicMessageService$$0 F
;$$F G
static&& 
DesignerController&& !
(&&! "
)&&" #
{'' 	

Stimulsoft)) 
.)) 
Base)) 
.)) 

StiLicense)) &
.))& '
LoadFromFile))' 3
())3 4
$str))4 A
)))A B
;))B C
}** 	
public++ 
DesignerController++ !
(++! "
FJTSqlDBContext++" 1
fjtSqlDBContext++2 A
,++A B$
IHttpsResponseRepository++C [$
iHttpsResponseRepository++\ t
,++t u
IOptions++v ~
<++~ 
ConstantPath	++ �
>
++� �
constantPath
++� �
,
++� �
IOptions
++� �
<
++� �
ConnectionStrings
++� �
>
++� �
connectionStrings
++� �
,
++� �
ILogger
++� �
<
++� � 
DesignerController
++� �
>
++� �
logger
++� �
,
++� � 
IUtilityController
++� �
utilityController
++� �
,
++� �$
IDynamicMessageService
++� �#
dynamicMessageService
++� �
)
++� �
:
++� �
base
++� �
(
++� �
fjtSqlDBContext
++� �
,
++� �
constantPath
++� �
)
++� �
{,, 	
_constantPath-- 
=-- 
constantPath-- (
.--( )
Value--) .
;--. /%
_iHttpsResponseRepository.. %
=..& '$
iHttpsResponseRepository..( @
;..@ A
_connectionStrings// 
=//  
connectionStrings//! 2
.//2 3
Value//3 8
;//8 9
_logger00 
=00 
logger00 
;00 
_utilityController11 
=11  
utilityController11! 2
;112 3"
_dynamicMessageService22 "
=22# $!
dynamicMessageService22% :
;22: ;
}33 	
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
tryAA 
{BB 
varCC 
reportModelCC 
=CC  !
newCC" %
SaveReportModelCC& 5
(CC5 6
)CC6 7
;CC7 8
varDD 

reportDataDD 
=DD  
awaitDD! &
_FJTSqlDBContextDD' 7
.DD7 8
reportmasterDD8 D
.DDD E
FirstOrDefaultAsyncDDE X
(DDX Y
xDDY Z
=>DD[ ]
xDD^ _
.DD_ `
fileNameDD` h
==DDi k
idDDl n
&&DDo q
xDDr s
.DDs t
	isDeletedDDt }
==	DD~ �
false
DD� �
)
DD� �
;
DD� �
ifEE 
(EE 

reportDataEE 
==EE !
nullEE" &
)EE& '
{FF 
varGG 
notFoundMSGGG #
=GG$ %
awaitGG& +"
_dynamicMessageServiceGG, B
.GGB C
GetGGC F
(GGF G
	NOT_FOUNDGGG P
)GGP Q
;GGQ R
returnHH 
ViewHH 
(HH  
$strHH  '
,HH' (
newHH) ,
ErrorViewModelHH- ;
{HH< =

StatusCodeHH> H
=HHI J
(HHK L
intHHL O
)HHO P
APIStatusCodeHHP ]
.HH] ^
PAGE_NOT_FOUNDHH^ l
,HHl m
MessageHHn u
=HHv w
stringHHx ~
.HH~ 
Format	HH �
(
HH� �
notFoundMSG
HH� �
.
HH� �
message
HH� �
,
HH� �
REPORT_DETAILS
HH� �
)
HH� �
}
HH� �
)
HH� �
;
HH� �
}II 
stringJJ 
reportCretatedByJJ '
=JJ( )
	GetUserIdJJ* 3
(JJ3 4
)JJ4 5
;JJ5 6
ifKK 
(KK 
(KK 
reportCretatedByKK %
==KK& (
nullKK) -
)KK- .
||KK/ 1
(KK2 3
reportCretatedByKK3 C
!=KKD F

reportDataKKG Q
.KKQ R
	createdByKKR [
)KK[ \
)KK\ ]
{LL 
returnMM 
RedirectToActionMM +
(MM+ ,
$strMM, :
,MM: ;
$strMM< G
)MMG H
;MMH I
}NN 
boolPP 
isDraftPP 
=PP 

reportDataPP )
.PP) *
statusPP* 0
==PP1 3
ReportStatusPP4 @
.PP@ A
DraftPPA F
.PPF G
GetDisplayValuePPG V
(PPV W
)PPW X
;PPX Y
varSS 
fileNameSS 
=SS 
(SS  
isDraftSS  '
&&SS( *

reportDataSS+ 5
.SS5 6
draftFileNameSS6 C
!=SSD F
nullSSG K
)SSK L
?SSM N

reportDataSSO Y
.SSY Z
draftFileNameSSZ g
:SSh i

reportDataSSj t
.SSt u
fileNameSSu }
;SS} ~
varTT 
responseModelTT !
=TT" #
_utilityControllerTT$ 6
.TT6 7#
CheckStatusOfReportFileTT7 N
(TTN O
fileNameTTO W
,TTW X

reportDataTTY c
.TTc d
isEndUserReportTTd s
==TTt v
trueTTw {
,TT{ |

reportData	TT} �
.
TT� �"
reportGenerationType
TT� �
)
TT� �
;
TT� �
ifVV 
(VV 
responseModelVV !
.VV! "
	IsSuccessVV" +
==VV, .
falseVV/ 4
||VV5 7
(VV8 9
boolVV9 =
)VV= >
responseModelVV> K
.VVK L
ModelVVL Q
==VVR T
falseVVU Z
)VVZ [
{WW 
varXX 
notFoundMSGXX #
=XX$ %
awaitXX& +"
_dynamicMessageServiceXX, B
.XXB C
GetXXC F
(XXF G
	NOT_FOUNDXXG P
)XXP Q
;XXQ R
returnYY 
ViewYY 
(YY  
$strYY  '
,YY' (
newYY) ,
ErrorViewModelYY- ;
{YY< =

StatusCodeYY> H
=YYI J
(YYK L
intYYL O
)YYO P
APIStatusCodeYYP ]
.YY] ^
PAGE_NOT_FOUNDYY^ l
,YYl m
MessageYYn u
=YYv w
stringYYx ~
.YY~ 
Format	YY �
(
YY� �
notFoundMSG
YY� �
.
YY� �
message
YY� �
,
YY� �
REPORT_ENTITY
YY� �
)
YY� �
}
YY� �
)
YY� �
;
YY� �
}ZZ 
reportModel\\ 
.\\ 

ReportGUID\\ &
=\\' (
id\\) +
;\\+ ,
reportModel]] 
.]] 

ReportName]] &
=]]' (

reportData]]) 3
.]]3 4

reportName]]4 >
;]]> ?
reportModel^^ 
.^^ 
PublishVersion^^ *
=^^+ ,

reportData^^- 7
.^^7 8
reportVersion^^8 E
;^^E F
reportModel__ 
.__ 
ReportStatus__ (
=__) *

reportData__+ 5
.__5 6
status__6 <
==__= ?
ReportStatus__@ L
.__L M
Draft__M R
.__R S
GetDisplayValue__S b
(__b c
)__c d
?__e f
ReportStatus__g s
.__s t
Draft__t y
.__y z
ToString	__z �
(
__� �
)
__� �
:
__� �
ReportStatus
__� �
.
__� �
	Published
__� �
.
__� �
ToString
__� �
(
__� �
)
__� �
;
__� �
ViewBag`` 
.`` 
	UiPageURL`` !
=``" #
_constantPath``$ 1
.``1 2
	UiPageUrl``2 ;
;``; <
ViewBagaa 
.aa #
printReportDataInHeaderaa /
=aa0 1
trueaa2 6
;aa6 7
varcc 
somethingWrongMSGcc %
=cc& '
awaitcc( -"
_dynamicMessageServicecc. D
.ccD E
GetccE H
(ccH I
SOMTHING_WRONGccI W
)ccW X
;ccX Y
vardd 
discardDraftMSGdd #
=dd$ %
awaitdd& +"
_dynamicMessageServicedd, B
.ddB C
GetddC F
(ddF G!
DISCARD_DRAFT_CHANGESddG \
)dd\ ]
;dd] ^
varee 
stopActivityMSGee #
=ee$ %
awaitee& +"
_dynamicMessageServiceee, B
.eeB C
GeteeC F
(eeF G!
CONFIRM_STOP_ACTIVITYeeG \
)ee\ ]
;ee] ^
ViewBagff 
.ff 
somethingWrongMSGff )
=ff* +
somethingWrongMSGff, =
.ff= >
messageff> E
;ffE F
ViewBaggg 
.gg 
discardDraftMSGgg '
=gg( )
discardDraftMSGgg* 9
.gg9 :
messagegg: A
;ggA B
ViewBaghh 
.hh 
stopActivityMSGhh '
=hh( )
stopActivityMSGhh* 9
.hh9 :
messagehh: A
;hhA B
ViewBagii 
.ii 
urlParameterii $
=ii% &
idii' )
;ii) *
returnjj 
Viewjj 
(jj 
reportModeljj '
)jj' (
;jj( )
}kk 
catchll 
(ll 
	Exceptionll 
ell 
)ll 
{mm 
_loggernn 
.nn 
LogErrornn  
(nn  !
enn! "
.nn" #
ToStringnn# +
(nn+ ,
)nn, -
)nn- .
;nn. /
returnoo 
Viewoo 
(oo 
$stroo #
,oo# $
newoo% (
ErrorViewModeloo) 7
{oo8 9

StatusCodeoo: D
=ooE F
(ooG H
intooH K
)ooK L
APIStatusCodeooL Y
.ooY Z!
INTERNAL_SERVER_ERRORooZ o
,ooo p
Messageooq x
=ooy z
eoo{ |
.oo| }
Message	oo} �
}
oo� �
)
oo� �
;
oo� �
}pp 
}qq 	
[xx 	
	Authorizexx	 
]xx 
publicyy 
asyncyy 
Taskyy 
<yy 
IActionResultyy '
>yy' (
	GetReportyy) 2
(yy2 3
stringyy3 9
idyy: <
)yy< =
{zz 	
try{{ 
{|| 
var}} 

reportData}} 
=}}  
await}}! &
_FJTSqlDBContext}}' 7
.}}7 8
reportmaster}}8 D
.}}D E
FirstOrDefaultAsync}}E X
(}}X Y
x}}Y Z
=>}}[ ]
x}}^ _
.}}_ `
fileName}}` h
==}}i k
id}}l n
&&}}o q
x}}r s
.}}s t
	isDeleted}}t }
==	}}~ �
false
}}� �
)
}}� �
;
}}� �
var~~ 
fileName~~ 
=~~ 
(~~  
(~~  !

reportData~~! +
.~~+ ,
status~~, 2
==~~3 5
ReportStatus~~6 B
.~~B C
Draft~~C H
.~~H I
GetDisplayValue~~I X
(~~X Y
)~~Y Z
)~~Z [
&&~~\ ^

reportData~~_ i
.~~i j
draftFileName~~j w
!=~~x z
null~~{ 
)	~~ �
?
~~� �

reportData
~~� �
.
~~� �
draftFileName
~~� �
:
~~� �

reportData
~~� �
.
~~� �
fileName
~~� �
;
~~� �
var
�� 
responseModel
�� !
=
��" #
await
��$ ) 
_utilityController
��* <
.
��< =
GetReportByteData
��= N
(
��N O
fileName
��O W
,
��W X

reportData
��Y c
.
��c d
isEndUserReport
��d s
==
��t v
true
��w {
,
��{ |

reportData��} �
.��� �$
reportGenerationType��� �
)��� �
;��� �
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
��+ ,
var
�� 

dictionary
�� 
=
��  
report
��! '
.
��' (

Dictionary
��( 2
;
��2 3
report
�� 
.
�� 

ReportName
�� !
=
��" #

reportData
��$ .
.
��. /

reportName
��/ 9
;
��9 :
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
�� 
var
�� 
dbList
�� 
=
�� 
report
�� #
.
��# $

Dictionary
��$ .
.
��. /
	Databases
��/ 8
.
��8 9
ToList
��9 ?
(
��? @
)
��@ A
;
��A B
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
��B C

reportData
��D N
.
��N O
reportTitle
��O Z
;
��Z [
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
��D E

reportData
��F P
.
��P Q
reportVersion
��Q ^
??
��_ a
$str
��b e
;
��e f
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
��* +*
Para_ImageFolderPathFor_ROHS
��+ G
)
��G H
)
��H I
{
�� 

dictionary
�� 
.
�� 
	Variables
�� (
[
��( )*
Para_ImageFolderPathFor_ROHS
��) E
]
��E F
.
��F G
Value
��G L
=
��M N
string
��O U
.
��U V
Concat
��V \
(
��\ ]
_constantPath
��] j
.
��j k
APIURL
��k q
,
��q r
_constantPath��s �
.��� �
RoHSImagesPath��� �
)��� �
;��� �
}
�� 
return
��  
StiNetCoreDesigner
�� )
.
��) *
GetReportResult
��* 9
(
��9 :
this
��: >
,
��> ?
report
��@ F
)
��F G
;
��G H
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
��. /
return
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
new
��% (
ErrorViewModel
��) 7
{
��8 9

StatusCode
��: D
=
��E F
(
��G H
int
��H K
)
��K L
APIStatusCode
��L Y
.
��Y Z#
INTERNAL_SERVER_ERROR
��Z o
,
��o p
Message
��q x
=
��y z
e
��{ |
.
��| }
Message��} �
}��� �
)��� �
;��� �
}
�� 
}
�� 	
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
��' (
DesignerEvent
��) 6
(
��6 7
)
��7 8
{
�� 	
return
�� 
await
��  
StiNetCoreDesigner
�� +
.
��+ ,&
DesignerEventResultAsync
��, D
(
��D E
this
��E I
)
��I J
;
��J K
}
�� 	
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
��' (
PreviewReport
��) 6
(
��6 7
)
��7 8
{
�� 	
	StiReport
�� 
report
�� 
=
��  
StiNetCoreDesigner
�� 1
.
��1 2#
GetActionReportObject
��2 G
(
��G H
this
��H L
)
��L M
;
��M N
return
�� 
await
��  
StiNetCoreDesigner
�� +
.
��+ ,&
PreviewReportResultAsync
��, D
(
��D E
this
��E I
,
��I J
report
��K Q
)
��Q R
;
��R S
}
�� 	
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
��' (

SaveReport
��) 3
(
��3 4
)
��4 5
{
�� 	
var
�� 
report
�� 
=
��  
StiNetCoreDesigner
�� +
.
��+ ,
GetReportObject
��, ;
(
��; <
this
��< @
)
��@ A
;
��A B
var
�� 
fileByte
�� 
=
�� 
report
�� !
.
��! "
SaveToByteArray
��" 1
(
��1 2
)
��2 3
;
��3 4
HttpContext
�� 
.
�� 
Session
�� 
.
��  
Set
��  #
(
��# $
$str
��$ 8
,
��8 9
fileByte
��: B
)
��B C
;
��C D
return
�� 
await
��  
StiNetCoreDesigner
�� +
.
��+ ,#
SaveReportResultAsync
��, A
(
��A B
this
��B F
)
��F G
;
��G H
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
ResponseModel
�� '
>
��' (
DiscardChanges
��) 7
(
��7 8
string
��8 >
id
��? A
)
��A B
{
�� 	
if
�� 
(
�� 
id
�� 
==
�� 
null
�� 
)
�� 
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `
BAD_REQUEST
��` k
,
��k l
Message
��m t
=
��u v"
invalidParameterMSG��w �
.��� �
message��� �
}��� �
;��� �
}
�� 
try
�� 
{
�� 
var
�� 

reportData
�� 
=
��  
await
��! &
_FJTSqlDBContext
��' 7
.
��7 8
reportmaster
��8 D
.
��D E
Where
��E J
(
��J K
x
��K L
=>
��M O
x
��P Q
.
��Q R
fileName
��R Z
==
��[ ]
id
��^ `
&&
��a c
x
��d e
.
��e f
	isDeleted
��f o
==
��p r
false
��s x
)
��x y
.
��y z"
FirstOrDefaultAsync��z �
(��� �
)��� �
;��� �
if
�� 
(
�� 

reportData
�� 
==
�� !
null
��" &
)
��& '
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
false
��= B
,
��B C

StatusCode
��D N
=
��O P
(
��Q R
int
��R U
)
��U V
APIStatusCode
��V c
.
��c d
PAGE_NOT_FOUND
��d r
,
��r s
Message
��t {
=
��| }
string��~ �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �
REPORT_DETAILS��� �
)��� �
}��� �
;��� �
}
�� 

reportData
�� 
.
�� 
status
�� !
=
��" #
ReportStatus
��$ 0
.
��0 1
	Published
��1 :
.
��: ;
GetDisplayValue
��; J
(
��J K
)
��K L
;
��L M

reportData
�� 
.
�� 
	updatedBy
�� $
=
��% &
	GetUserId
��' 0
(
��0 1
)
��1 2
;
��2 3

reportData
�� 
.
�� 
	updatedAt
�� $
=
��% &
StaticMethods
��' 4
.
��4 5
GetUtcDateTime
��5 C
(
��C D
)
��D E
;
��E F

reportData
�� 
.
�� 
updateByRoleId
�� )
=
��* +
null
��, 0
;
��0 1
System
�� 
.
�� 
IO
�� 
.
�� 
File
�� 
.
�� 
Delete
�� %
(
��% &
_constantPath
��& 3
.
��3 4

ReportPath
��4 >
+
��? @

reportData
��A K
.
��K L
draftFileName
��L Y
+
��Z [
REPORT_EXTENSION
��\ l
)
��l m
;
��m n

reportData
�� 
.
�� 
draftFileName
�� (
=
��) *
null
��+ /
;
��/ 0
await
�� 
_FJTSqlDBContext
�� &
.
��& '
SaveChangesAsync
��' 7
(
��7 8
)
��8 9
;
��9 :
var
�� 
responseMSG
�� 
=
��  !
await
��" '$
_dynamicMessageService
��( >
.
��> ?
Get
��? B
(
��B C*
SUCCESSFULLY_DISCARD_CHANGES
��C _
)
��_ `
;
��` a
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
true
��9 =
,
��= >

StatusCode
��? I
=
��J K
(
��L M
int
��M P
)
��P Q
APIStatusCode
��Q ^
.
��^ _
SUCCESS
��_ f
,
��f g
Message
��h o
=
��p q
responseMSG
��r }
.
��} ~
message��~ �
}��� �
;��� �
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
�� 
somethingWrongMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
SOMTHING_WRONG
��I W
)
��W X
;
��X Y
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `#
INTERNAL_SERVER_ERROR
��` u
,
��u v
Message
��w ~
=�� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
;��� �
}
�� 
}
�� 	
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
ResponseModel
�� '
>
��' (
StopActivity
��) 5
(
��5 6
string
��6 <
id
��= ?
)
��? @
{
�� 	
if
�� 
(
�� 
id
�� 
==
�� 
null
�� 
)
�� 
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
��] ^
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `
BAD_REQUEST
��` k
,
��k l
Message
��m t
=
��u v"
invalidParameterMSG��w �
.��� �
message��� �
}��� �
;��� �
}
�� 
try
�� 
{
�� 
var
�� 

reportData
�� 
=
��  
await
��! &
_FJTSqlDBContext
��' 7
.
��7 8
reportmaster
��8 D
.
��D E
Where
��E J
(
��J K
x
��K L
=>
��M O
x
��P Q
.
��Q R
fileName
��R Z
==
��[ ]
id
��^ `
&&
��a c
x
��d e
.
��e f
	isDeleted
��f o
==
��p r
false
��s x
)
��x y
.
��y z"
FirstOrDefaultAsync��z �
(��� �
)��� �
;��� �
if
�� 
(
�� 

reportData
�� 
==
�� !
null
��" &
)
��& '
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
��Q R
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
false
��= B
,
��B C

StatusCode
��D N
=
��O P
(
��Q R
int
��R U
)
��U V
APIStatusCode
��V c
.
��c d
PAGE_NOT_FOUND
��d r
,
��r s
Message
��t {
=
��| }
string��~ �
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
;��� �
}
�� 

reportData
�� 
.
�� 
	editingBy
�� $
=
��% &
null
��' +
;
��+ ,

reportData
�� 
.
��  
startDesigningDate
�� -
=
��. /
null
��0 4
;
��4 5
var
�� 
reportChangeLog
�� #
=
��$ %
await
��& +
_FJTSqlDBContext
��, <
.
��< = 
report_change_logs
��= O
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
��j k
reportId
��k s
==
��t v

reportData��w �
.��� �
id��� �
&&��� �
x��� �
.��� �
endActivityDate��� �
==��� �
null��� �
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
�� 
reportChangeLog
�� #
==
��$ &
null
��' +
)
��+ ,
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
��Q R
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
false
��= B
,
��B C

StatusCode
��D N
=
��O P
(
��Q R
int
��R U
)
��U V
APIStatusCode
��V c
.
��c d
PAGE_NOT_FOUND
��d r
,
��r s
Message
��t {
=
��| }
string��~ �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �&
START_ACTIVITY_DETAILS��� �
)��� �
}��� �
;��� �
}
�� 
reportChangeLog
�� 
.
��  
endActivityDate
��  /
=
��0 1
StaticMethods
��2 ?
.
��? @
GetUtcDateTime
��@ N
(
��N O
)
��O P
;
��P Q
reportChangeLog
�� 
.
��  
	updatedBy
��  )
=
��* +
	GetUserId
��, 5
(
��5 6
)
��6 7
;
��7 8
reportChangeLog
�� 
.
��  
	updatedAt
��  )
=
��* +
StaticMethods
��, 9
.
��9 :
GetUtcDateTime
��: H
(
��H I
)
��I J
;
��J K
reportChangeLog
�� 
.
��  
updateByRoleId
��  .
=
��/ 0
null
��1 5
;
��5 6
await
�� 
_FJTSqlDBContext
�� &
.
��& '
SaveChangesAsync
��' 7
(
��7 8
)
��8 9
;
��9 :
var
�� 
responseMSG
�� 
=
��  !
await
��" '$
_dynamicMessageService
��( >
.
��> ?
Get
��? B
(
��B C#
STOP_ACTIVITY_SUCCESS
��C X
)
��X Y
;
��Y Z
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
true
��9 =
,
��= >

StatusCode
��? I
=
��J K
(
��L M
int
��M P
)
��P Q
APIStatusCode
��Q ^
.
��^ _
SUCCESS
��_ f
,
��f g
Message
��h o
=
��p q
responseMSG
��r }
.
��} ~
message��~ �
}��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
var
�� 
somethingWrongMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
SOMTHING_WRONG
��I W
)
��W X
;
��X Y
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `#
INTERNAL_SERVER_ERROR
��` u
,
��u v
Message
��w ~
=�� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
;��� �
}
�� 
}
�� 	
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
ResponseModel
�� '
>
��' ("
SaveReportBySaveMode
��) =
(
��= >
[
��> ?
FromBody
��? G
]
��G H
SaveReportModel
��I X
	saveModel
��Y b
)
��b c
{
�� 	
if
�� 
(
�� 
	saveModel
�� 
==
�� 
null
�� !
)
��! "
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
��] ^
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `
BAD_REQUEST
��` k
,
��k l
Message
��m t
=
��u v"
invalidParameterMSG��w �
.��� �
message��� �
}��� �
;��� �
}
�� 
HttpContext
�� 
.
�� 
Session
�� 
.
��  
TryGetValue
��  +
(
��+ ,
$str
��, @
,
��@ A
out
��B E
byte
��F J
[
��J K
]
��K L
reportByteData
��M [
)
��[ \
;
��\ ]
if
�� 
(
�� 
reportByteData
�� 
==
�� !
null
��" &
)
��& '
{
�� 
var
�� 
somethingWrongMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
SOMTHING_WRONG
��I W
)
��W X
;
��X Y
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `#
INTERNAL_SERVER_ERROR
��` u
,
��u v
Message
��w ~
=�� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
;��� �
}
�� 
	saveModel
�� 
.
�� 
ReportByteData
�� $
=
��% &
reportByteData
��' 5
;
��5 6
try
�� 
{
�� 
var
�� 
reportMaster
��  
=
��! "
await
��# (
_FJTSqlDBContext
��) 9
.
��9 :
reportmaster
��: F
.
��F G!
FirstOrDefaultAsync
��G Z
(
��Z [
x
��[ \
=>
��] _
x
��` a
.
��a b
fileName
��b j
==
��k m
	saveModel
��n w
.
��w x

ReportGUID��x �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
var
�� 
reportVersion
�� !
=
��" #
$num
��$ %
;
��% &
if
�� 
(
�� 
reportMaster
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
��Q R
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
false
��= B
,
��B C

StatusCode
��D N
=
��O P
(
��Q R
int
��R U
)
��U V
APIStatusCode
��V c
.
��c d
PAGE_NOT_FOUND
��d r
,
��r s
Message
��t {
=
��| }
string��~ �
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
;��� �
}
�� 
reportMaster
�� 
.
�� 
	updatedBy
�� &
=
��' (
	GetUserId
��) 2
(
��2 3
)
��3 4
;
��4 5
reportMaster
�� 
.
�� 
	updatedAt
�� &
=
��' (
StaticMethods
��) 6
.
��6 7
GetUtcDateTime
��7 E
(
��E F
)
��F G
;
��G H
reportMaster
�� 
.
�� 
updateByRoleId
�� +
=
��, -
null
��. 2
;
��2 3
var
�� 
reportFolderPath
�� $
=
��% &
_constantPath
��' 4
.
��4 5

ReportPath
��5 ?
;
��? @
if
�� 
(
�� 
	saveModel
�� 
.
�� 
SaveReportMode
�� ,
==
��- /
PUBLISH_MODE
��0 <
)
��< =
{
�� 
reportMaster
��  
.
��  !
status
��! '
=
��( )
ReportStatus
��* 6
.
��6 7
	Published
��7 @
.
��@ A
GetDisplayValue
��A P
(
��P Q
)
��Q R
;
��R S
if
�� 
(
�� 
!
�� 
(
�� 
	saveModel
�� #
.
��# $
PublishVersion
��$ 2
==
��3 5
null
��6 :
||
��; =
	saveModel
��> G
.
��G H
PublishVersion
��H V
==
��W Y
$str
��Z \
)
��\ ]
)
��] ^
{
�� 
reportVersion
�� %
=
��& '
Int32
��( -
.
��- .
Parse
��. 3
(
��3 4
	saveModel
��4 =
.
��= >
PublishVersion
��> L
)
��L M
+
��N O
$num
��P Q
;
��Q R
}
�� 
reportMaster
��  
.
��  !
reportVersion
��! .
=
��/ 0
reportVersion
��1 >
.
��> ?
ToString
��? G
(
��G H
)
��H I
;
��I J
System
�� 
.
�� 
IO
�� 
.
�� 
File
�� "
.
��" #
WriteAllBytes
��# 0
(
��0 1
reportFolderPath
��1 A
+
��B C
	saveModel
��D M
.
��M N

ReportGUID
��N X
+
��Y Z
REPORT_EXTENSION
��[ k
,
��k l
	saveModel
��m v
.
��v w
ReportByteData��w �
)��� �
;��� �
System
�� 
.
�� 
IO
�� 
.
�� 
File
�� "
.
��" #
Delete
��# )
(
��) *
reportFolderPath
��* :
+
��; <
reportMaster
��= I
.
��I J
draftFileName
��J W
+
��X Y
REPORT_EXTENSION
��Z j
)
��j k
;
��k l
reportMaster
��  
.
��  !
draftFileName
��! .
=
��/ 0
null
��1 5
;
��5 6
await
�� 
_FJTSqlDBContext
�� *
.
��* +
SaveChangesAsync
��+ ;
(
��; <
)
��< =
;
��= >
var
�� 
publishedMSG
�� $
=
��% &
await
��' ,$
_dynamicMessageService
��- C
.
��C D
Get
��D G
(
��G H$
SUCCESSFULLY_PUBLISHED
��H ^
)
��^ _
;
��_ `
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
true
��= A
,
��A B

StatusCode
��C M
=
��N O
(
��P Q
int
��Q T
)
��T U
APIStatusCode
��U b
.
��b c
SUCCESS
��c j
,
��j k
Message
��l s
=
��t u
publishedMSG��v �
.��� �
message��� �
}��� �
;��� �
}
�� 
else
�� 
if
�� 
(
�� 
	saveModel
�� "
.
��" #
SaveReportMode
��# 1
==
��2 4

DRAFT_MODE
��5 ?
)
��? @
{
�� 
reportMaster
��  
.
��  !
status
��! '
=
��( )
ReportStatus
��* 6
.
��6 7
Draft
��7 <
.
��< =
GetDisplayValue
��= L
(
��L M
)
��M N
;
��N O
if
�� 
(
�� 
reportMaster
�� $
.
��$ %
draftFileName
��% 2
==
��3 5
null
��6 :
)
��: ;
{
�� 
reportMaster
�� $
.
��$ %
draftFileName
��% 2
=
��3 4
System
��5 ;
.
��; <
Guid
��< @
.
��@ A
NewGuid
��A H
(
��H I
)
��I J
.
��J K
ToString
��K S
(
��S T
)
��T U
;
��U V
}
�� 
System
�� 
.
�� 
IO
�� 
.
�� 
File
�� "
.
��" #
WriteAllBytes
��# 0
(
��0 1
reportFolderPath
��1 A
+
��B C
reportMaster
��D P
.
��P Q
draftFileName
��Q ^
+
��_ `
REPORT_EXTENSION
��a q
,
��q r
	saveModel
��s |
.
��| }
ReportByteData��} �
)��� �
;��� �
await
�� 
_FJTSqlDBContext
�� *
.
��* +
SaveChangesAsync
��+ ;
(
��; <
)
��< =
;
��= >
var
�� 
responseMSG
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
��F G(
SUCCESSFULLY_SAVE_AS_DRAFT
��G a
)
��a b
;
��b c
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
true
��= A
,
��A B

StatusCode
��C M
=
��N O
(
��P Q
int
��Q T
)
��T U
APIStatusCode
��U b
.
��b c
SUCCESS
��c j
,
��j k
Message
��l s
=
��t u
responseMSG��v �
.��� �
message��� �
}��� �
;��� �
}
�� 
else
�� 
{
�� 
var
�� !
invalidParameterMSG
�� +
=
��, -
await
��. 3$
_dynamicMessageService
��4 J
.
��J K
Get
��K N
(
��N O
INVALID_PARAMETER
��O `
)
��` a
;
��a b
return
�� 
new
�� 
ResponseModel
�� ,
(
��, -
)
��- .
{
��/ 0
	IsSuccess
��1 :
=
��; <
false
��= B
,
��B C

StatusCode
��D N
=
��O P
(
��Q R
int
��R U
)
��U V
APIStatusCode
��V c
.
��c d
BAD_REQUEST
��d o
,
��o p
Message
��q x
=
��y z"
invalidParameterMSG��{ �
.��� �
message��� �
}��� �
;��� �
}
�� 
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
��X Y
return
�� 
new
�� 
ResponseModel
�� (
(
��( )
)
��) *
{
��+ ,
	IsSuccess
��- 6
=
��7 8
false
��9 >
,
��> ?

StatusCode
��@ J
=
��K L
(
��M N
int
��N Q
)
��Q R
APIStatusCode
��R _
.
��_ `#
INTERNAL_SERVER_ERROR
��` u
,
��u v
Message
��w ~
=�� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
;��� �
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
��' (
ExitDesigner
��) 5
(
��5 6
string
��6 <
id
��= ?
)
��? @
{
�� 	
if
�� 
(
�� 
id
�� 
==
�� 
null
�� 
)
�� 
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
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
new
��% (
ErrorViewModel
��) 7
{
��8 9

StatusCode
��: D
=
��E F
(
��G H
int
��H K
)
��K L
APIStatusCode
��L Y
.
��Y Z
BAD_REQUEST
��Z e
,
��e f
Message
��g n
=
��o p"
invalidParameterMSG��q �
.��� �
message��� �
}��� �
)��� �
;��� �
}
�� 
var
�� 
responseModel
�� 
=
�� 
await
��  %
StopActivity
��& 2
(
��2 3
id
��3 5
)
��5 6
;
��6 7
if
�� 
(
�� 
responseModel
�� 
.
�� 
	IsSuccess
�� '
==
��( *
false
��+ 0
)
��0 1
{
�� 
return
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
new
��% (
ErrorViewModel
��) 7
{
��8 9

StatusCode
��: D
=
��E F
responseModel
��G T
.
��T U

StatusCode
��U _
,
��_ `
Message
��a h
=
��i j
responseModel
��k x
.
��x y
Message��y �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
return
�� 
Redirect
�� 
(
��  
_constantPath
��  -
.
��- .
	UiPageUrl
��. 7
)
��7 8
;
��8 9
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
�� &
)
��& '
]
��' (
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
��' (
CreateReport
��) 5
(
��5 6
[
��6 7
FromBody
��7 ?
]
��? @
ReportmasterVM
��A O
reportmasterVM
��P ^
)
��^ _
{
�� 	
if
�� 
(
�� 
reportmasterVM
�� 
==
�� !
null
��" &
)
��& '
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
�� 
var
�� 
isUpdate
�� 
=
�� 
false
�� $
;
��$ %
var
�� #
newReportFromTemplate
�� )
=
��* +
false
��, 1
;
��1 2
var
��  
templateReportPath
�� &
=
��' (
string
��) /
.
��/ 0
Empty
��0 5
;
��5 6
var
�� 

reportName
�� 
=
��  
reportmasterVM
��! /
.
��/ 0

reportName
��0 :
;
��: ;
var
�� 

reportPath
�� 
=
��  
_constantPath
��! .
.
��. /

ReportPath
��/ 9
;
��9 :
int
�� 
?
�� 
entityId
�� 
=
�� 
reportmasterVM
��  .
.
��. /
entityId
��/ 7
;
��7 8
int
�� 
?
�� 
reportCategoryId
�� %
=
��& '
reportmasterVM
��( 6
.
��6 7
gencCategoryID
��7 E
;
��E F
if
�� 
(
�� 
reportmasterVM
�� "
.
��" #
id
��# %
!=
��& (
$num
��) *
)
��* +
{
�� 
isUpdate
�� 
=
�� 
true
�� #
;
��# $
}
�� 
if
�� 
(
�� 
reportmasterVM
�� "
.
��" #
isDefaultReport
��# 2
)
��2 3
{
�� 
var
�� 
defaultReport
�� %
=
��& '
await
��( -
_FJTSqlDBContext
��. >
.
��> ?
reportmaster
��? K
.
��K L!
FirstOrDefaultAsync
��L _
(
��_ `
x
��` a
=>
��b d
x
��e f
.
��f g
entityId
��g o
==
��p r
entityId
��s {
&&
��| ~
x�� �
.��� �
isDefaultReport��� �
==��� �
true��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
defaultReport
�� %
!=
��& (
null
��) -
)
��- .
{
�� 
defaultReport
�� %
.
��% &
isDefaultReport
��& 5
=
��6 7
false
��8 =
;
��= >
}
�� 
}
�� 
ReportIdModel
�� 
reportIdModel
�� +
=
��, -
new
��. 1
ReportIdModel
��2 ?
(
��? @
)
��@ A
;
��A B
if
�� 
(
�� 
isUpdate
�� 
)
�� 
{
�� 
var
�� 
reportNameUnique
�� (
=
��) *
await
��+ 0
_FJTSqlDBContext
��1 A
.
��A B
reportmaster
��B N
.
��N O
AnyAsync
��O W
(
��W X
x
��X Y
=>
��Z \
x
��] ^
.
��^ _
id
��_ a
!=
��b d
reportmasterVM
��e s
.
��s t
id
��t v
&&
��w y
x
��z {
.
��{ |

reportName��| �
==��� �

reportName��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
reportNameUnique
�� (
==
��) +
true
��, 0
)
��0 1
{
�� 
var
�� 
uniqueNameMSG
�� )
=
��* +
await
��, 1$
_dynamicMessageService
��2 H
.
��H I
Get
��I L
(
��L M 
MUST_UNIQUE_GLOBAL
��M _
)
��_ `
;
��` a
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
uniqueNameMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
uniqueNameMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
uniqueNameMSG��� �
.��� �
message��� �
,��� �
REPORT_NAME��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
bool
�� 
flag
�� 
=
�� 
false
��  %
;
��% &
var
�� 
reportmasterData
�� (
=
��) *
await
��+ 0
_FJTSqlDBContext
��1 A
.
��A B
reportmaster
��B N
.
��N O!
FirstOrDefaultAsync
��O b
(
��b c
x
��c d
=>
��e g
x
��h i
.
��i j
id
��j l
==
��m o
reportmasterVM
��p ~
.
��~ 
id�� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
reportmasterData
�� (
.
��( )
isDefaultReport
��) 8
==
��9 ;
true
��< @
&&
��A C
!
��D E
reportmasterVM
��E S
.
��S T
isDefaultReport
��T c
)
��c d
{
�� 
var
�� #
systemGeneratedReport
�� 1
=
��2 3
await
��4 9
_FJTSqlDBContext
��: J
.
��J K
reportmaster
��K W
.
��W X!
FirstOrDefaultAsync
��X k
(
��k l
x
��l m
=>
��n p
x
��q r
.
��r s
entityId
��s {
==
��| ~
reportmasterVM�� �
.��� �
entityId��� �
&&��� �
x��� �
.��� �$
reportGenerationType��� �
==��� �
(��� �
(��� �
int��� �
)��� �
ReportCategory��� �
.��� �%
SystemGeneratedReport��� �
)��� �
.��� �
ToString��� �
(��� �
)��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� #
systemGeneratedReport
�� 1
!=
��2 4
null
��5 9
)
��9 :
{
�� 
if
�� 
(
��  #
systemGeneratedReport
��  5
.
��5 6
id
��6 8
==
��9 ;
reportmasterVM
��< J
.
��J K
id
��K M
)
��M N
{
��O P
flag
��Q U
=
��V W
true
��X \
;
��\ ]
}
��^ _
else
��  
{
�� #
systemGeneratedReport
��  5
.
��5 6
isDefaultReport
��6 E
=
��F G
true
��H L
;
��L M#
systemGeneratedReport
��  5
.
��5 6
	updatedAt
��6 ?
=
��@ A
StaticMethods
��B O
.
��O P
GetUtcDateTime
��P ^
(
��^ _
)
��_ `
;
��` a#
systemGeneratedReport
��  5
.
��5 6
	updatedBy
��6 ?
=
��@ A
reportmasterVM
��B P
.
��P Q
userId
��Q W
.
��W X
ToString
��X `
(
��` a
)
��a b
;
��b c#
systemGeneratedReport
��  5
.
��5 6
updateByRoleId
��6 D
=
��E F
reportmasterVM
��G U
.
��U V

userRoleId
��V `
;
��` a
}
�� 
}
�� 
}
�� 
if
�� 
(
�� 
reportmasterData
�� (
==
��) +
null
��, 0
)
��0 1
{
�� 
var
�� 
notFoundMSG
�� '
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
��J K
	NOT_FOUND
��K T
)
��T U
;
��U V
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �
REPORT_DETAILS��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
if
�� 
(
�� 
reportmasterData
�� (
.
��( )
	editingBy
��) 2
!=
��3 5
null
��6 :
)
��: ;
{
�� 
var
��  
activityStartedMSG
�� .
=
��/ 0
await
��1 6$
_dynamicMessageService
��7 M
.
��M N
Get
��N Q
(
��Q R&
ACTIVITY_ALREADY_STARTED
��R j
)
��j k
;
��k l
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �"
activityStartedMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �"
activityStartedMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �"
activityStartedMSG��� �
.��� �
message��� �
,��� �
GetUserNameById��� �
(��� � 
reportmasterData��� �
.��� �
	editingBy��� �
)��� �
,��� � 
reportmasterData��� �
.��� �"
startDesigningDate��� �
.��� �
Value��� �
.��� �
ToLocalTime��� �
(��� �
)��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
reportmasterData
�� $
.
��$ %

reportName
��% /
=
��0 1

reportName
��2 <
;
��< =
reportmasterData
�� $
.
��$ %
reportTitle
��% 0
=
��1 2
reportmasterVM
��3 A
.
��A B
reportTitle
��B M
;
��M N
reportmasterData
�� $
.
��$ %
entityId
��% -
=
��. /
entityId
��0 8
==
��9 ;
$num
��< =
?
��> ?
null
��@ D
:
��E F
entityId
��G O
;
��O P
if
�� 
(
�� 
reportmasterVM
�� &
.
��& '
gencCategoryID
��' 5
==
��6 8
$num
��9 :
)
��: ;
{
�� 
reportmasterVM
�� &
.
��& '
gencCategoryID
��' 5
=
��6 7
null
��8 <
;
��< =
}
�� 
reportmasterData
�� $
.
��$ %
reportCategoryId
��% 5
=
��6 7
reportmasterVM
��8 F
.
��F G
gencCategoryID
��G U
;
��U V
reportmasterData
�� $
.
��$ %
reportViewType
��% 3
=
��4 5
reportmasterVM
��6 D
.
��D E

reportType
��E O
==
��P R
(
��S T
(
��T U
int
��U X
)
��X Y

ReportType
��Y c
.
��c d
Detail
��d j
)
��j k
;
��k l
reportmasterData
�� $
.
��$ %
additionalNotes
��% 4
=
��5 6
reportmasterVM
��7 E
.
��E F
additionalNotes
��F U
;
��U V
reportmasterData
�� $
.
��$ %
isDefaultReport
��% 4
=
��5 6
flag
��7 ;
||
��< >
reportmasterVM
��? M
.
��M N
isDefaultReport
��N ]
;
��] ^
reportmasterData
�� $
.
��$ %
	updatedAt
��% .
=
��/ 0
StaticMethods
��1 >
.
��> ?
GetUtcDateTime
��? M
(
��M N
)
��N O
;
��O P
reportmasterData
�� $
.
��$ %
	updatedBy
��% .
=
��/ 0
reportmasterVM
��1 ?
.
��? @
userId
��@ F
.
��F G
ToString
��G O
(
��O P
)
��P Q
;
��Q R
reportmasterData
�� $
.
��$ %
updateByRoleId
��% 3
=
��4 5
reportmasterVM
��6 D
.
��D E

userRoleId
��E O
;
��O P
await
�� 
_FJTSqlDBContext
�� *
.
��* +
SaveChangesAsync
��+ ;
(
��; <
)
��< =
;
��= >
reportIdModel
�� !
.
��! "
Id
��" $
=
��% &
reportmasterVM
��' 5
.
��5 6
id
��6 8
;
��8 9
reportIdModel
�� !
.
��! "
fileName
��" *
=
��+ ,
reportmasterData
��- =
.
��= >
fileName
��> F
;
��F G
var
�� 

resMessage
�� "
=
��# $
await
��% *$
_dynamicMessageService
��+ A
.
��A B
Get
��B E
(
��E F
UPDATED
��F M
)
��M N
;
��N O
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
reportIdModel
��k x
,
��x y
new
��z }
UserMessage��~ �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

resMessage��� �
.��� �
message��� �
,��� �
REPORT_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
var
�� 
reportNameUnique
�� (
=
��) *
await
��+ 0
_FJTSqlDBContext
��1 A
.
��A B
reportmaster
��B N
.
��N O
AnyAsync
��O W
(
��W X
x
��X Y
=>
��Z \
x
��] ^
.
��^ _

reportName
��_ i
==
��j l

reportName
��m w
&&
��x z
x
��{ |
.
��| }
	isDeleted��} �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
reportNameUnique
�� (
==
��) +
true
��, 0
)
��0 1
{
�� 
var
�� 
uniqueNameMSG
�� )
=
��* +
await
��, 1$
_dynamicMessageService
��2 H
.
��H I
Get
��I L
(
��L M 
MUST_UNIQUE_GLOBAL
��M _
)
��_ `
;
��` a
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
uniqueNameMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
uniqueNameMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
uniqueNameMSG��� �
.��� �
message��� �
,��� �
REPORT_NAME��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
int
�� 
?
�� 
templateReportId
�� )
=
��* +
null
��, 0
;
��0 1
var
�� &
templateReportFolderPath
�� 0
=
��1 2
string
��3 9
.
��9 :
Empty
��: ?
;
��? @
if
�� 
(
�� 
reportmasterVM
�� &
.
��& '
reportCreateType
��' 7
==
��8 :
(
��; <
int
��< ?
)
��? @
ReportCreateType
��@ P
.
��P Q
CloneFromReport
��Q `
)
��` a
{
�� &
templateReportFolderPath
�� 0
=
��1 2
reportmasterVM
��3 A
.
��A B
isEndUserReport
��B Q
?
��R S

reportPath
��T ^
:
��_ `
(
��a b
reportmasterVM
��b p
.
��p q#
reportGenerationType��q �
==��� �
(��� �
(��� �
int��� �
)��� �
ReportCategory��� �
.��� �%
SystemGeneratedReport��� �
)��� �
.��� �
ToString��� �
(��� �
)��� �
?��� �
_constantPath��� �
.��� �)
SystemGeneratedReportPath��� �
:��� �
_constantPath��� �
.��� �"
TemplateReportPath��� �
)��� �
;��� �
templateReportId
�� (
=
��) *
reportmasterVM
��+ 9
.
��9 :
refReportId
��: E
;
��E F
}
�� 
else
�� 
{
�� 
templateReportId
�� (
=
��) *
reportmasterVM
��+ 9
.
��9 :

templateId
��: D
!=
��E G
$num
��H I
?
��J K
reportmasterVM
��L Z
.
��Z [

templateId
��[ e
:
��f g
null
��h l
;
��l m#
newReportFromTemplate
�� -
=
��. /
true
��0 4
;
��4 5&
templateReportFolderPath
�� 0
=
��1 2
_constantPath
��3 @
.
��@ A 
TemplateReportPath
��A S
;
��S T
}
�� 
if
�� 
(
�� 
templateReportId
�� (
!=
��) +
null
��, 0
)
��0 1
{
�� 
var
��  
templateReportData
�� .
=
��/ 0
await
��1 6
_FJTSqlDBContext
��7 G
.
��G H
reportmaster
��H T
.
��T U!
FirstOrDefaultAsync
��U h
(
��h i
x
��i j
=>
��k m
x
��n o
.
��o p
id
��p r
==
��s u
templateReportId��v �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
��  
templateReportData
�� .
==
��/ 1
null
��2 6
)
��6 7
{
�� 
var
�� 
notFoundMSG
��  +
=
��, -
await
��. 3$
_dynamicMessageService
��4 J
.
��J K
Get
��K N
(
��N O
	NOT_FOUND
��O X
)
��X Y
;
��Y Z
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �%
newReportFromTemplate��� �
?��� � 
TEMPLATE_DETAILS��� �
:��� �!
COPY_FROM_DETAILS��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
��  
templateReportPath
�� *
=
��+ ,&
templateReportFolderPath
��- E
+
��F G 
templateReportData
��H Z
.
��Z [
fileName
��[ c
+
��d e
REPORT_EXTENSION
��f v
;
��v w
if
�� 
(
�� 
!
�� 
(
�� 
System
�� $
.
��$ %
IO
��% '
.
��' (
File
��( ,
.
��, -
Exists
��- 3
(
��3 4 
templateReportPath
��4 F
)
��F G
)
��G H
)
��H I
{
�� 
var
�� 
notExistsMSG
��  ,
=
��- .
await
��/ 4$
_dynamicMessageService
��5 K
.
��K L
Get
��L O
(
��O P
$str
��P \
)
��\ ]
;
��] ^
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notExistsMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notExistsMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notExistsMSG��� �
.��� �
message��� �
,��� �%
newReportFromTemplate��� �
?��� �
TEMPLATE��� �
:��� �
	COPY_FROM��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
List
�� 
<
�� #
reportmasterparameter
�� .
>
��. /$
reportmasterparameters
��0 F
=
��G H
new
��I L
List
��M Q
<
��Q R#
reportmasterparameter
��R g
>
��g h
(
��h i
)
��i j
;
��j k
var
�� 
refReportId
�� #
=
��$ %#
newReportFromTemplate
��& ;
?
��< =
null
��> B
:
��C D
reportmasterVM
��E S
.
��S T
refReportId
��T _
;
��_ `
if
�� 
(
�� 
refReportId
�� #
!=
��$ &
null
��' +
)
��+ ,
{
�� 
var
�� #
requiredParameterList
�� 1
=
��2 3
await
��4 9
_FJTSqlDBContext
��: J
.
��J K#
reportmasterparameter
��K `
.
��` a
Where
��a f
(
��f g
x
��g h
=>
��i k
x
��l m
.
��m n
reportId
��n v
==
��w y
refReportId��z �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
new��� �
{��� �
x��� �
.��� �!
parmeterMappingid��� �
,��� �
x��� �
.��� �

isRequired��� �
}��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
foreach
�� 
(
��  !
var
��! $
item
��% )
in
��* ,#
requiredParameterList
��- B
)
��B C
{
�� #
reportmasterparameter
�� 1#
reportmasterparameter
��2 G
=
��H I
new
��J M#
reportmasterparameter
��N c
{
�� 
parmeterMappingid
��  1
=
��2 3
item
��4 8
.
��8 9
parmeterMappingid
��9 J
,
��J K

isRequired
��  *
=
��+ ,
item
��- 1
.
��1 2

isRequired
��2 <
,
��< =
	createdBy
��  )
=
��* +
reportmasterVM
��, :
.
��: ;
userId
��; A
.
��A B
ToString
��B J
(
��J K
)
��K L
,
��L M
createByRoleId
��  .
=
��/ 0
reportmasterVM
��1 ?
.
��? @

userRoleId
��@ J
,
��J K
	createdAt
��  )
=
��* +
StaticMethods
��, 9
.
��9 :
GetUtcDateTime
��: H
(
��H I
)
��I J
}
�� 
;
�� $
reportmasterparameters
�� 2
.
��2 3
Add
��3 6
(
��6 7#
reportmasterparameter
��7 L
)
��L M
;
��M N
}
�� 
}
�� 
reportmaster
��  
reportMasterObj
��! 0
=
��1 2
new
��3 6
reportmaster
��7 C
{
�� 

reportName
�� "
=
��# $

reportName
��% /
,
��/ 0 
rdlcReportFileName
�� *
=
��+ ,

reportName
��- 7
,
��7 8
reportTitle
�� #
=
��$ %
reportmasterVM
��& 4
.
��4 5
reportTitle
��5 @
,
��@ A
entityId
��  
=
��! "
entityId
��# +
==
��, .
$num
��/ 0
?
��1 2
null
��3 7
:
��8 9
entityId
��: B
,
��B C
reportCategoryId
�� (
=
��) *
reportCategoryId
��+ ;
==
��< >
$num
��? @
?
��A B
null
��C G
:
��H I
reportCategoryId
��J Z
,
��Z [
reportViewType
�� &
=
��' (
reportmasterVM
��) 7
.
��7 8

reportType
��8 B
==
��C E
(
��F G
int
��G J
)
��J K

ReportType
��K U
.
��U V
Detail
��V \
,
��\ ]
isEndUserReport
�� '
=
��( )
true
��* .
,
��. /
fileName
��  
=
��! "
System
��# )
.
��) *
Guid
��* .
.
��. /
NewGuid
��/ 6
(
��6 7
)
��7 8
.
��8 9
ToString
��9 A
(
��A B
)
��B C
,
��C D
refReportId
�� #
=
��$ %
refReportId
��& 1
,
��1 2
status
�� 
=
��  
ReportStatus
��! -
.
��- .
Draft
��. 3
.
��3 4
GetDisplayValue
��4 C
(
��C D
)
��D E
,
��E F"
reportGenerationType
�� ,
=
��- .
reportmasterVM
��/ =
.
��= >"
reportGenerationType
��> R
==
��S U
(
��V W
(
��W X
int
��X [
)
��[ \
ReportCategory
��\ j
.
��j k
TemplateReport
��k y
)
��y z
.
��z {
ToString��{ �
(��� �
)��� �
?��� �
(��� �
(��� �
int��� �
)��� �
ReportCategory��� �
.��� �
TemplateReport��� �
)��� �
.��� �
ToString��� �
(��� �
)��� �
:��� �
(��� �
(��� �
int��� �
)��� �
ReportCategory��� �
.��� �
EndUserReport��� �
)��� �
.��� �
ToString��� �
(��� �
)��� �
,��� �
	createdBy
�� !
=
��" #
reportmasterVM
��$ 2
.
��2 3
userId
��3 9
.
��9 :
ToString
��: B
(
��B C
)
��C D
,
��D E
createByRoleId
�� &
=
��' (
reportmasterVM
��) 7
.
��7 8

userRoleId
��8 B
,
��B C
	createdAt
�� !
=
��" #
StaticMethods
��$ 1
.
��1 2
GetUtcDateTime
��2 @
(
��@ A
)
��A B
,
��B C
additionalNotes
�� '
=
��( )
reportmasterVM
��* 8
.
��8 9
additionalNotes
��9 H
,
��H I
isDefaultReport
�� '
=
��( )
reportmasterVM
��* 8
.
��8 9
isDefaultReport
��9 H
,
��H I$
reportmasterparameters
�� .
=
��/ 0$
reportmasterparameters
��1 G
}
�� 
;
�� 
_FJTSqlDBContext
�� $
.
��$ %
reportmaster
��% 1
.
��1 2
Add
��2 5
(
��5 6
reportMasterObj
��6 E
)
��E F
;
��F G
await
�� 
_FJTSqlDBContext
�� *
.
��* +
SaveChangesAsync
��+ ;
(
��; <
)
��< =
;
��= >
reportIdModel
�� !
.
��! "
Id
��" $
=
��% &
reportMasterObj
��' 6
.
��6 7
id
��7 9
;
��9 :
reportIdModel
�� !
.
��! "
fileName
��" *
=
��+ ,
reportMasterObj
��- <
.
��< =
fileName
��= E
;
��E F
System
�� 
.
�� 
IO
�� 
.
�� 
	Directory
�� '
.
��' (
CreateDirectory
��( 7
(
��7 8

reportPath
��8 B
)
��B C
;
��C D
var
�� 
reportWithPath
�� &
=
��' (

reportPath
��) 3
+
��4 5
reportMasterObj
��6 E
.
��E F
fileName
��F N
+
��O P
REPORT_EXTENSION
��Q a
;
��a b
if
�� 
(
�� 
templateReportId
�� (
!=
��) +
null
��, 0
)
��0 1
{
�� 
System
�� 
.
�� 
IO
�� !
.
��! "
File
��" &
.
��& '
Copy
��' +
(
��+ , 
templateReportPath
��, >
,
��> ?
reportWithPath
��@ N
)
��N O
;
��O P
}
�� 
else
�� 
{
�� 
var
�� 
report
�� "
=
��# $
new
��% (
	StiReport
��) 2
(
��2 3
)
��3 4
;
��4 5
StiMySqlDatabase
�� (
db
��) +
=
��, -
new
��. 1
StiMySqlDatabase
��2 B
(
��B C"
REPORT_DATABASE_NAME
��C W
,
��W X"
REPORT_DATABASE_NAME
��Y m
,
��m n!
_connectionStrings��o �
.��� � 
ReportConnection��� �
)��� �
;��� �
report
�� 
.
�� 

Dictionary
�� )
.
��) *
	Databases
��* 3
.
��3 4
Add
��4 7
(
��7 8
db
��8 :
)
��: ;
;
��; <
report
�� 
.
�� 
Save
�� #
(
��# $
reportWithPath
��$ 2
)
��2 3
;
��3 4
}
�� 
var
�� 

resMessage
�� "
=
��# $
await
��% *$
_dynamicMessageService
��+ A
.
��A B
Get
��B E
(
��E F
CREATED
��F M
)
��M N
;
��N O
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
reportIdModel
��k x
,
��x y
new
��z }
UserMessage��~ �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

resMessage��� �
.��� �
message��� �
,��� �
REPORT_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
ex
��! #
.
��# $
ToString
��$ ,
(
��, -
)
��- .
)
��. /
;
��/ 0
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
ex
��O Q
)
��Q R
;
��R S
}
�� 
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
Error
��) .
(
��. /
)
��/ 0
{
�� 	
var
�� 
somethingWrongMSG
�� !
=
��" #
await
��$ )$
_dynamicMessageService
��* @
.
��@ A
Get
��A D
(
��D E
SOMTHING_WRONG
��E S
)
��S T
;
��T U
return
�� 
View
�� 
(
�� 
new
�� 
ErrorViewModel
�� *
{
��+ ,

StatusCode
��- 7
=
��8 9
(
��: ;
int
��; >
)
��> ?
APIStatusCode
��? L
.
��L M#
INTERNAL_SERVER_ERROR
��M b
,
��b c
Message
��d k
=
��l m
somethingWrongMSG
��n 
.�� �
message��� �
}��� �
)��� �
;��� �
}
�� 	
}
�� 
}�� �/
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\DesignReportController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ +
DeveloperAuthorizationAttribute $
]$ %
public 

class "
DesignReportController '
:( )
BaseController* 8
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
private 
readonly 
ILogger  
<  !
DesignerController! 3
>3 4
_logger5 <
;< =
static   "
DesignReportController   %
(  % &
)  & '
{!! 	

Stimulsoft## 
.## 
Base## 
.## 

StiLicense## &
.##& '
LoadFromFile##' 3
(##3 4
$str##4 A
)##A B
;##B C
}$$ 	
public%% "
DesignReportController%% %
(%%% &
FJTSqlDBContext%%& 5
fjtSqlDBContext%%6 E
,%%E F
IOptions%%G O
<%%O P
ConstantPath%%P \
>%%\ ]
constantPath%%^ j
,%%j k#
IDynamicMessageService	%%l �#
dynamicMessageService
%%� �
,
%%� �
ILogger
%%� �
<
%%� � 
DesignerController
%%� �
>
%%� �
logger
%%� �
)
%%� �
:
%%� �
base
%%� �
(
%%� �
fjtSqlDBContext
%%� �
,
%%� �
constantPath
%%� �
)
%%� �
{&& 	
_constantPath'' 
='' 
constantPath'' (
.''( )
Value'') .
;''. /"
_dynamicMessageService(( "
=((# $!
dynamicMessageService((% :
;((: ;
_logger)) 
=)) 
logger)) 
;)) 
}** 	
public11 
IActionResult11 !
SystemGeneratedReport11 2
(112 3
)113 4
{22 	
return33 
View33 
(33 
)33 
;33 
}44 	
public;; 
async;; 
Task;; 
<;; 
IActionResult;; '
>;;' (
	GetReport;;) 2
(;;2 3
);;3 4
{<< 	
try== 
{>> 
var@@ 
report@@ 
=@@ 
new@@  
	StiReport@@! *
(@@* +
)@@+ ,
;@@, -
returnAA 
awaitAA 
StiNetCoreDesignerAA /
.AA/ 0 
GetReportResultAsyncAA0 D
(AAD E
thisAAE I
,AAI J
reportAAK Q
)AAQ R
;AAR S
}BB 
catchCC 
(CC 
	ExceptionCC 
eCC 
)CC 
{DD 
_loggerEE 
.EE 
LogErrorEE  
(EE  !
eEE! "
.EE" #
ToStringEE# +
(EE+ ,
)EE, -
)EE- .
;EE. /
varFF 
somethingWrongMSGFF %
=FF& '
awaitFF( -"
_dynamicMessageServiceFF. D
.FFD E
GetFFE H
(FFH I
SOMTHING_WRONGFFI W
)FFW X
;FFX Y
returnGG 
ViewGG 
(GG 
$strGG #
,GG# $
newGG% (
ErrorViewModelGG) 7
{GG8 9

StatusCodeGG: D
=GGE F
(GGG H
intGGH K
)GGK L
APIStatusCodeGGL Y
.GGY Z!
INTERNAL_SERVER_ERRORGGZ o
,GGo p
MessageGGq x
=GGy z
somethingWrongMSG	GG{ �
.
GG� �
message
GG� �
}
GG� �
)
GG� �
;
GG� �
}HH 
}II 	
publicOO 
asyncOO 
TaskOO 
<OO 
IActionResultOO '
>OO' (
DesignerEventOO) 6
(OO6 7
)OO7 8
{PP 	
returnQQ 
awaitQQ 
StiNetCoreDesignerQQ +
.QQ+ ,$
DesignerEventResultAsyncQQ, D
(QQD E
thisQQE I
)QQI J
;QQJ K
}RR 	
publicXX 
asyncXX 
TaskXX 
<XX 
IActionResultXX '
>XX' (
PreviewReportXX) 6
(XX6 7
)XX7 8
{YY 	
	StiReportZZ 
reportZZ 
=ZZ 
StiNetCoreDesignerZZ 1
.ZZ1 2!
GetActionReportObjectZZ2 G
(ZZG H
thisZZH L
)ZZL M
;ZZM N
return[[ 
await[[ 
StiNetCoreDesigner[[ +
.[[+ ,$
PreviewReportResultAsync[[, D
([[D E
this[[E I
,[[I J
report[[K Q
)[[Q R
;[[R S
}\\ 	
publicbb 
asyncbb 
Taskbb 
<bb 
IActionResultbb '
>bb' (

SaveReportbb) 3
(bb3 4
)bb4 5
{cc 	
returndd 
awaitdd 
StiNetCoreDesignerdd +
.dd+ ,!
SaveReportResultAsyncdd, A
(ddA B
thisddB F
)ddF G
;ddG H
}ee 	
publicgg 
asyncgg 
Taskgg 
<gg 
IActionResultgg '
>gg' (
Errorgg) .
(gg. /
)gg/ 0
{hh 	
varii 
somethingWrongMSGii !
=ii" #
awaitii$ )"
_dynamicMessageServiceii* @
.ii@ A
GetiiA D
(iiD E
SOMTHING_WRONGiiE S
)iiS T
;iiT U
returnjj 
Viewjj 
(jj 
newjj 
ErrorViewModeljj *
{jj+ ,

StatusCodejj- 7
=jj8 9
(jj: ;
intjj; >
)jj> ?
APIStatusCodejj? L
.jjL M!
INTERNAL_SERVER_ERRORjjM b
,jjb c
Messagejjd k
=jjl m
somethingWrongMSGjjn 
.	jj �
message
jj� �
}
jj� �
)
jj� �
;
jj� �
}kk 	
}mm 
}nn �
\D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\DeveloperAuthorizationAttribute.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{		 
[

 
AttributeUsage

 
(

 
AttributeTargets

 $
.

$ %
Class

% *
)

* +
]

+ ,
public 

class +
DeveloperAuthorizationAttribute 0
:1 2
	Attribute3 <
,< = 
IAuthorizationFilter> R
{ 
public 
void 
OnAuthorization #
(# $&
AuthorizationFilterContext$ >
filterContext? L
)L M
{ 	
if 
( 
Startup 
. 
IsDevelopmentMode )
)) *
{ 
return 
; 
} 
else 
{ 
filterContext 
. 
HttpContext )
.) *
Response* 2
.2 3

StatusCode3 =
=> ?
(@ A
intA D
)D E
HttpStatusCodeE S
.S T
NotFoundT \
;\ ]
filterContext 
. 
Result $
=% &
new' *
	Microsoft+ 4
.4 5

AspNetCore5 ?
.? @
Mvc@ C
.C D!
RedirectToRouteResultD Y
(Y Z
newZ ] 
RouteValueDictionary^ r
(r s
news v
{w x

controller	y �
=
� �
$str
� �
,
� �
action
� �
=
� �
$str
� �
}
� �
)
� �
)
� �
;
� �
} 
} 	
} 
} �
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Controllers\LogOutController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Controllers (
{ 
[ 
AllowAnonymous 
] 
public 

class 
LogOutController !
:" #

Controller$ .
{ 
private 
readonly  
IdentityserverConfig -!
_identityserverConfig. C
;C D
public 
LogOutController 
(  
IOptions! )
<) * 
IdentityserverConfig* >
>> ? 
identityserverConfig@ T
)T U
{ 	!
_identityserverConfig !
=" # 
identityserverConfig$ 8
.8 9
Value9 >
;> ?
} 	
public 
IActionResult 
LogOut #
(# $
)$ %
{ 	
return 
new 
SignOutResult $
($ %
new% (
[( )
]) *
{+ ,!
_identityserverConfig- B
.B C 
AuthenticationSchemeC W
,W X
ConstantHelperY g
.g h4
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME	h �
}
� �
)
� �
;
� �
} 	
public 
IActionResult 
SignoutCleanup +
(+ ,
string, 2
sid3 6
)6 7
{ 	
var 
claims 
= 
User 
as  
ClaimsPrincipal! 0
;0 1
var 
sidClaim 
= 
claims !
.! "
	FindFirst" +
(+ ,
$str, 1
)1 2
;2 3
if   
(   
sidClaim   
!=   
null    
&&  ! #
sidClaim  $ ,
.  , -
Value  - 2
==  3 5
sid  6 9
)  9 :
{!! 
HttpContext"" 
."" 
SignOutAsync"" (
(""( )!
_identityserverConfig"") >
.""> ? 
AuthenticationScheme""? S
)""S T
;""T U
foreach$$ 
($$ 
var$$ 
cookie$$ #
in$$$ &
Request$$' .
.$$. /
Cookies$$/ 6
.$$6 7
Keys$$7 ;
)$$; <
{%% 
Response&& 
.&& 
Cookies&& $
.&&$ %
Delete&&% +
(&&+ ,
cookie&&, 2
)&&2 3
;&&3 4
}'' 
}(( 
HttpContext)) 
.)) 
Session)) 
.))  
Remove))  &
())& '
$str))' 9
)))9 :
;)): ;
return++ 
Content++ 
(++ 
string++ !
.++! "
Empty++" '
)++' (
;++( )
},, 	
}-- 
}.. �
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ConstantReportVariable.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
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
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportCategory.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
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
} �
GD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportCreateType.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{ 
public		 

enum		 
ReportCreateType		  
{

 
[ 	
Display	 
( 
Name 
= 
$str '
)' (
]( )
CloneFromTemplate 
, 
[ 	
Display	 
( 
Name 
= 
$str %
)% &
]& '
CloneFromReport 
} 
} �
CD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportStatus.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
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
} �
AD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Enums\ReportType.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Enums "
{ 
public		 

enum		 

ReportType		 
{

 
[ 	
Display	 
( 
Name 
= 
$str !
)! "
]" #
Summary 
, 
[ 	
Display	 
( 
Name 
= 
$str  
)  !
]! "
Detail 
} 
} �7
FD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\ConstantHelper.cs
	namespace		 	
FJT		
 
.		 
ReportDesigner		 
.		 
Helper		 #
{

 
public 

class 
ConstantHelper 
{ 
public 
enum 
APIStatusCode !
{ 	
SUCCESS 
= 
$num 
, 
ERROR 
= 
$num 
, 
BAD_REQUEST 
= 
$num 
, 
UNAUTHORIZED 
= 
$num 
, 
PAGE_NOT_FOUND 
= 
$num  
,  !
ACCESS_DENIED 
= 
$num 
,  !
INTERNAL_SERVER_ERROR !
=" #
$num$ '
} 	
public 
enum 
APIState 
{ 	
[ 
Display 
( 
Name 
= 
$str %
)% &
]& '
SUCCESS 
, 
[ 
Display 
( 
Name 
= 
$str $
)$ %
]% &
FAILED 
} 	
public   
const   
string   3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEME   C
=  D E
$str  F T
;  T U
public!! 
const!! 
string!! 
PROJECT_NAME!! (
=!!) *
$str!!+ @
;!!@ A
public"" 
const"" 
string"" 
REPORT_EXTENSION"" ,
=""- .
$str""/ 5
;""5 6
public$$ 
static$$ 
string$$ 

TOKEN_PATH$$ '
=$$( )
$str$$* :
;$$: ;
public%% 
static%% 
string%% ,
 VALIDATE_CLIENT_USER_MAPPING_URL%% =
=%%> ?
$str%%@ o
;%%o p
public'' 
static'' 
string'' 
REPORT_DETAILS'' +
='', -
$str''. ?
;''? @
public(( 
static(( 
string(( 
REPORT_NAME(( (
=(() *
$str((+ 8
;((8 9
public)) 
static)) 
string)) 
REPORT_ENTITY)) *
=))+ ,
$str))- 5
;))5 6
public** 
static** 
string** 
TEMPLATE** %
=**& '
$str**( ;
;**; <
public++ 
static++ 
string++ 
TEMPLATE_DETAILS++ -
=++. /
$str++0 B
;++B C
public,, 
static,, 
string,, 
	COPY_FROM,, &
=,,' (
$str,,) ;
;,,; <
public-- 
static-- 
string-- 
COPY_FROM_DETAILS-- .
=--/ 0
$str--1 K
;--K L
public.. 
static.. 
string.. "
START_ACTIVITY_DETAILS.. 3
=..4 5
$str..6 ]
;..] ^
public// 
static// 
string// 
REQUESTED_PAGE// +
=//, -
$str//. F
;//F G
public00 
static00 
string00 
	REQUESTED00 &
=00' (
$str00) 4
;004 5
public33 
const33 
string33 

DRAFT_MODE33 &
=33' (
$str33) 0
;330 1
public44 
const44 
string44 
PUBLISH_MODE44 (
=44) *
$str44+ 4
;444 5
public55 
const55 
string55 
SAVE_AS_DRAFT55 )
=55* +
$str55, ;
;55; <
public66 
const66 
string66 
SAVE_AND_PUBLISH66 ,
=66- .
$str66/ ?
;66? @
public99 
const99 
string99  
REPORT_DATABASE_NAME99 0
=991 2
$str993 >
;99> ?
public:: 
const:: 
string:: 
PARA_REPORT_TITLE:: -
=::. /
$str::0 B
;::B C
public;; 
const;; 
string;; 
PARA_REPORT_VERSION;; /
=;;0 1
$str;;2 G
;;;G H
public<< 
const<< 
string<< (
Para_ImageFolderPathFor_ROHS<< 8
=<<9 :
$str<<; Y
;<<Y Z
public?? 
const?? 
string?? 
INVALID_PARAMETER?? -
=??. /
$str??0 C
;??C D
public@@ 
const@@ 
string@@ 
SOMTHING_WRONG@@ *
=@@+ ,
$str@@- =
;@@= >
publicAA 
constAA 
stringAA 
	NOT_FOUNDAA %
=AA& '
$strAA( 3
;AA3 4
publicBB 
constBB 
stringBB 
MUST_UNIQUE_GLOBALBB .
=BB/ 0
$strBB1 E
;BBE F
publicCC 
constCC 
stringCC $
ACTIVITY_ALREADY_STARTEDCC 4
=CC5 6
$strCC7 Q
;CCQ R
publicDD 
constDD 
stringDD 
CREATEDDD #
=DD$ %
$strDD& /
;DD/ 0
publicEE 
constEE 
stringEE 
UPDATEDEE #
=EE$ %
$strEE& /
;EE/ 0
publicFF 
constFF 
stringFF 
ALREADY_EXISTSFF *
=FF+ ,
$strFF- =
;FF= >
publicGG 
constGG 
stringGG 
POPUP_ACCESS_DENIEDGG /
=GG0 1
$strGG2 G
;GGG H
publicHH 
constHH 
stringHH !
DISCARD_DRAFT_CHANGESHH 1
=HH2 3
$strHH4 K
;HHK L
publicII 
constII 
stringII !
CONFIRM_STOP_ACTIVITYII 1
=II2 3
$strII4 K
;IIK L
publicJJ 
constJJ 
stringJJ "
CONFIRM_REPORT_VERSIONJJ 2
=JJ3 4
$strJJ5 M
;JJM N
publicKK 
constKK 
stringKK (
SUCCESSFULLY_DISCARD_CHANGESKK 8
=KK9 :
$strKK; Y
;KKY Z
publicLL 
constLL 
stringLL !
STOP_ACTIVITY_SUCCESSLL 1
=LL2 3
$strLL4 K
;LLK L
publicMM 
constMM 
stringMM "
SUCCESSFULLY_PUBLISHEDMM 2
=MM3 4
$strMM5 M
;MMM N
publicNN 
constNN 
stringNN &
SUCCESSFULLY_SAVE_AS_DRAFTNN 6
=NN7 8
$strNN9 U
;NNU V
publicQQ 
staticQQ 
stringQQ 
LOGOUT_CONFIRMATIONQQ 0
=QQ1 2
$str	QQ3 �
;
QQ� �
publicRR 
constRR 
stringRR &
MAY_YOUR_SESSION_ISEXPIREDRR 6
=RR7 8
$strRR9 W
;RRW X
publicSS 
constSS 
stringSS $
MONGODB_CONNECTION_ERRORSS 4
=SS5 6
$str	SS7 �
;
SS� �
}UU 
}VV � 
ND:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\MemoryCacheTicketStore.cs
	namespace		 	
FJT		
 
.		 
ReportDesigner		 
.		 
Helper		 #
{

 
public 

class "
MemoryCacheTicketStore '
:( )
ITicketStore* 6
{ 
private 
const 
string 
	KeyPrefix &
=' (
$str) <
;< =
private 
IMemoryCache 
_cache #
;# $
public "
MemoryCacheTicketStore %
(% &
)& '
{ 	
_cache 
= 
new 
MemoryCache $
($ %
new% (
MemoryCacheOptions) ;
(; <
)< =
)= >
;> ?
} 	
public 
async 
Task 
< 
string  
>  !

StoreAsync" ,
(, - 
AuthenticationTicket- A
ticketB H
)H I
{ 	
var 
guid 
= 
Guid 
. 
NewGuid #
(# $
)$ %
;% &
var 
key 
= 
	KeyPrefix 
+  !
guid" &
.& '
ToString' /
(/ 0
)0 1
;1 2
await 

RenewAsync 
( 
key  
,  !
ticket" (
)( )
;) *
return 
key 
; 
} 	
public 
Task 

RenewAsync 
( 
string %
key& )
,) * 
AuthenticationTicket+ ?
ticket@ F
)F G
{ 	
var 
options 
= 
new #
MemoryCacheEntryOptions 5
(5 6
)6 7
;7 8
var   

expiresUtc   
=   
ticket   #
.  # $

Properties  $ .
.  . /

ExpiresUtc  / 9
;  9 :
if!! 
(!! 

expiresUtc!! 
.!! 
HasValue!! #
)!!# $
{"" 
options## 
.## !
SetAbsoluteExpiration## -
(##- .

expiresUtc##. 8
.##8 9
Value##9 >
)##> ?
;##? @
}$$ 
options%% 
.%%  
SetSlidingExpiration%% (
(%%( )
TimeSpan%%) 1
.%%1 2
	FromHours%%2 ;
(%%; <
$num%%< =
)%%= >
)%%> ?
;%%? @
_cache'' 
.'' 
Set'' 
('' 
key'' 
,'' 
ticket'' "
,''" #
options''$ +
)''+ ,
;'', -
return)) 
Task)) 
.)) 

FromResult)) "
())" #
$num))# $
)))$ %
;))% &
}** 	
public,, 
Task,, 
<,,  
AuthenticationTicket,, (
>,,( )
RetrieveAsync,,* 7
(,,7 8
string,,8 >
key,,? B
),,B C
{-- 	 
AuthenticationTicket..  
ticket..! '
;..' (
_cache// 
.// 
TryGetValue// 
(// 
key// "
,//" #
out//$ '
ticket//( .
)//. /
;/// 0
return00 
Task00 
.00 

FromResult00 "
(00" #
ticket00# )
)00) *
;00* +
}11 	
public33 
Task33 
RemoveAsync33 
(33  
string33  &
key33' *
)33* +
{44 	
_cache55 
.55 
Remove55 
(55 
key55 
)55 
;55 
return66 
Task66 
.66 

FromResult66 "
(66" #
$num66# $
)66$ %
;66% &
}77 	
}88 
}99 �	
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\ResponseModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Helper #
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
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Helper\StaticMethods.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Helper #
{		 
public

 

static

 
class

 
StaticMethods

 %
{ 
public 
static 
string 
GetDisplayValue ,
(, -
this- 1
Enum2 6
instance7 ?
)? @
{ 	
var 
	fieldInfo 
= 
instance $
.$ %
GetType% ,
(, -
)- .
.. /
	GetMember/ 8
(8 9
instance9 A
.A B
ToStringB J
(J K
)K L
)L M
.M N
SingleN T
(T U
)U V
;V W
var !
descriptionAttributes %
=& '
	fieldInfo( 1
.1 2
GetCustomAttributes2 E
(E F
typeofF L
(L M
DisplayAttributeM ]
)] ^
,^ _
false` e
)e f
asg i
DisplayAttributej z
[z {
]{ |
;| }
if 
( !
descriptionAttributes %
==& (
null) -
)- .
return/ 5
instance6 >
.> ?
ToString? G
(G H
)H I
;I J
return 
( !
descriptionAttributes )
.) *
Length* 0
>1 2
$num3 4
)4 5
?6 7!
descriptionAttributes8 M
[M N
$numN O
]O P
.P Q
GetNameQ X
(X Y
)Y Z
:[ \
instance] e
.e f
ToStringf n
(n o
)o p
;p q
} 	
public 
static 
DateTime 
GetUtcDateTime -
(- .
). /
{ 	
return 
DateTime 
. 
UtcNow !
;! "
} 	
} 
} �
FD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ErrorViewModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
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
} �
HD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\FilterParameters.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
} �
HD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ReportByteDataVM.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
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
} �
ED:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ReportIdModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
ReportIdModel 
{		 
public

 
int

 
Id

 
{

 
get

 
;

 
set

  
;

  !
}

" #
public 
string 
fileName 
{  
get! $
;$ %
set& )
;) *
}+ ,
} 
} �
FD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\ReportmasterVM.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
ReportmasterVM 
{ 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
reportTitle !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
fileName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
reportCreateType #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
int 
? 

templateId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public"" 
int"" 
?"" 
refReportId"" 
{""  !
get""" %
;""% &
set""' *
;""* +
}"", -
public$$ 
bool$$ 
isEndUserReport$$ #
{$$$ %
get$$& )
;$$) *
set$$+ .
;$$. /
}$$0 1
public&& 
string&&  
reportGenerationType&& *
{&&+ ,
get&&- 0
;&&0 1
set&&2 5
;&&5 6
}&&7 8
public)) 
int)) 
?)) 
entityId)) 
{)) 
get)) "
;))" #
set))$ '
;))' (
}))) *
public,, 
int,, 
?,, 
gencCategoryID,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
public// 
int// 

reportType// 
{// 
get//  #
;//# $
set//% (
;//( )
}//* +
public22 
int22 
userId22 
{22 
get22 
;22  
set22! $
;22$ %
}22& '
public55 
int55 

userRoleId55 
{55 
get55  #
;55# $
set55% (
;55( )
}55* +
public77 
string77 
additionalNotes77 %
{77& '
get77( +
;77+ ,
set77- 0
;770 1
}772 3
public99 
bool99 
isDefaultReport99 #
{99$ %
get99& )
;99) *
set99+ .
;99. /
}990 1
}:: 
};; �$
PD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\RequestFilterParameterVM.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public		 

class		 $
RequestFilterParameterVM		 )
{

 
public 
int 
? 

customerID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 
partID 
{ 
get  
;  !
set" %
;% &
}' (
public 
int 
? 

employeeID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 

supplierID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
? 
	mfgCodeID 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
? 
assyID 
{ 
get  
;  !
set" %
;% &
}' (
public 
int 
? 
mountingTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
? 
functionalTypeID $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
int 
? 
partStatusID  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
int 
? 
workorderID 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
? 
operationID 
{  !
get" %
;% &
set' *
;* +
}, -
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
public 
int 
? 
radioButtonFilter %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
DateTime 
? 
fromDate !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
toDate 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
? 
fromTime !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
toTime 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
? 
packingSlipId !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public   
string   
	deletedBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public!! 
int!! 
createByRoleId!! !
{!!" #
get!!$ '
;!!' (
set!!) ,
;!!, -
}!!. /
public"" 
int"" 
?"" 
updateByRoleId"" "
{""# $
get""% (
;""( )
set""* -
;""- .
}""/ 0
public## 
int## 
?## 
deleteByRoleId## "
{### $
get##% (
;##( )
set##* -
;##- .
}##/ 0
public$$ 
string$$ 

reportName$$  
{$$! "
get$$# &
;$$& '
set$$( +
;$$+ ,
}$$- .
}%% 
}&& �
GD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Models\SaveReportModel.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
Models #
{ 
public 

class 
SaveReportModel  
{		 
public

 
string

 

ReportGUID
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
public 
string 

ReportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
SaveReportMode $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
byte 
[ 
] 
ReportByteData $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
PublishVersion $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
ReportStatus "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
Error 
{ 
get !
;! "
set# &
;& '
}( )
} 
} �
LD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MongoDbModel\DynamicMessage.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MongoDbModel )
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
public 
object 
previousVersion %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} � 
DD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\entity.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
TD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\FixedEntityDataelement.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
}@@ �
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\FJTSqlDBContext.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
< 
users "
>" #
users$ )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
virtual 
DbSet 
< !
reportviewerparameter 2
>2 3!
reportviewerparameter4 I
{J K
getL O
;O P
setQ T
;T U
}V W
public 
virtual 
DbSet 
< !
reportmasterparameter 2
>2 3!
reportmasterparameter4 I
{J K
getL O
;O P
setQ T
;T U
}V W
public 
virtual 
DbSet 
< "
FixedEntityDataelement 3
>3 4#
FixedEntityDataelements5 L
{M N
getO R
;R S
setT W
;W X
}Y Z
public 
virtual 
DbSet 
< 
Systemconfigrations 0
>0 1
Systemconfigrations2 E
{F G
getH K
;K L
setM P
;P Q
}R S
} 
} �*
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\genericcategory.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
}11 �j
JD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\reportmaster.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
{ 
public 
reportmaster 
( 
) 
{ 	"
reportmasterparameters "
=# $
new% (
HashSet) 0
<0 1!
reportmasterparameter1 F
>F G
(G H
)H I
;I J
} 	
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 

reportName  
{! "
get# &
;& '
set( +
;+ ,
}- .
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
rdlcReportFileName (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
reportTitle !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
int 
? 

customerID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public!! 
int!! 
?!! 
partID!! 
{!! 
get!!  
;!!  !
set!!" %
;!!% &
}!!' (
public## 
int## 
?## 
	companyID## 
{## 
get##  #
;### $
set##% (
;##( )
}##* +
public%% 
int%% 
?%% 
fromDate%% 
{%% 
get%% "
;%%" #
set%%$ '
;%%' (
}%%) *
public'' 
int'' 
?'' 
toDate'' 
{'' 
get''  
;''  !
set''" %
;''% &
}''' (
public)) 
string)) 
logicalExpression)) '
{))( )
get))* -
;))- .
set))/ 2
;))2 3
}))4 5
public++ 
bool++ 
	isDeleted++ 
{++ 
get++  #
;++# $
set++% (
;++( )
}++* +
public-- 
DateTime-- 
	createdAt-- !
{--" #
get--$ '
;--' (
set--) ,
;--, -
}--. /
[// 	
StringLength//	 
(// 
$num// 
)// 
]// 
public00 
string00 
	createdBy00 
{00  !
get00" %
;00% &
set00' *
;00* +
}00, -
public22 
DateTime22 
?22 
	updatedAt22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
[44 	
StringLength44	 
(44 
$num44 
)44 
]44 
public55 
string55 
	updatedBy55 
{55  !
get55" %
;55% &
set55' *
;55* +
}55, -
public77 
DateTime77 
?77 
	deletedAt77 "
{77# $
get77% (
;77( )
set77* -
;77- .
}77/ 0
[99 	
StringLength99	 
(99 
$num99 
)99 
]99 
public:: 
string:: 
	deletedBy:: 
{::  !
get::" %
;::% &
set::' *
;::* +
}::, -
public<< 
bool<< 
withAlternateParts<< &
{<<' (
get<<) ,
;<<, -
set<<. 1
;<<1 2
}<<3 4
public>> 
int>> 
?>> 
customerSelectType>> &
{>>' (
get>>) ,
;>>, -
set>>. 1
;>>1 2
}>>3 4
public@@ 
int@@ 
?@@ 
partSelectType@@ "
{@@# $
get@@% (
;@@( )
set@@* -
;@@- .
}@@/ 0
publicBB 
intBB 
?BB 

employeeIDBB 
{BB  
getBB! $
;BB$ %
setBB& )
;BB) *
}BB+ ,
publicDD 
intDD 
?DD 
employeeSelectTypeDD &
{DD' (
getDD) ,
;DD, -
setDD. 1
;DD1 2
}DD3 4
publicFF 
intFF 
?FF 

supplierIDFF 
{FF  
getFF! $
;FF$ %
setFF& )
;FF) *
}FF+ ,
publicHH 
intHH 
?HH 
supplierSelectTypeHH &
{HH' (
getHH) ,
;HH, -
setHH. 1
;HH1 2
}HH3 4
publicJJ 
intJJ 
?JJ 
	mfgCodeIDJJ 
{JJ 
getJJ  #
;JJ# $
setJJ% (
;JJ( )
}JJ* +
publicLL 
intLL 
?LL 
mfgCodeSelectTypeLL %
{LL& '
getLL( +
;LL+ ,
setLL- 0
;LL0 1
}LL2 3
publicNN 
intNN 
?NN 
assyIDNN 
{NN 
getNN  
;NN  !
setNN" %
;NN% &
}NN' (
publicPP 
intPP 
?PP 
assySelectTypePP "
{PP# $
getPP% (
;PP( )
setPP* -
;PP- .
}PP/ 0
publicRR 
intRR 
?RR 
mountingTypeIDRR "
{RR# $
getRR% (
;RR( )
setRR* -
;RR- .
}RR/ 0
publicTT 
intTT 
?TT "
mountingTypeSelectTypeTT *
{TT+ ,
getTT- 0
;TT0 1
setTT2 5
;TT5 6
}TT7 8
publicVV 
intVV 
?VV 
functionalTypeIDVV $
{VV% &
getVV' *
;VV* +
setVV, /
;VV/ 0
}VV1 2
publicXX 
intXX 
?XX $
functionalTypeSelectTypeXX ,
{XX- .
getXX/ 2
;XX2 3
setXX4 7
;XX7 8
}XX9 :
publicZZ 
intZZ 
?ZZ 
partStatusIDZZ  
{ZZ! "
getZZ# &
;ZZ& '
setZZ( +
;ZZ+ ,
}ZZ- .
public\\ 
int\\ 
?\\  
partStatusSelectType\\ (
{\\) *
get\\+ .
;\\. /
set\\0 3
;\\3 4
}\\5 6
public^^ 
int^^ 
?^^ 
workorderID^^ 
{^^  !
get^^" %
;^^% &
set^^' *
;^^* +
}^^, -
public`` 
int`` 
?`` 
workorderSelectType`` '
{``( )
get``* -
;``- .
set``/ 2
;``2 3
}``4 5
publicbb 
intbb 
?bb 
operationIDbb 
{bb  !
getbb" %
;bb% &
setbb' *
;bb* +
}bb, -
publicdd 
intdd 
?dd 
operationSelectTypedd '
{dd( )
getdd* -
;dd- .
setdd/ 2
;dd2 3
}dd4 5
publicff 
intff 
?ff 
reportCategoryIdff $
{ff% &
getff' *
;ff* +
setff, /
;ff/ 0
}ff1 2
publichh 
boolhh 
?hh 
reportViewTypehh #
{hh$ %
gethh& )
;hh) *
sethh+ .
;hh. /
}hh0 1
[jj 	
StringLengthjj	 
(jj 
$numjj 
)jj 
]jj 
publickk 
stringkk 
	reportAPIkk 
{kk  !
getkk" %
;kk% &
setkk' *
;kk* +
}kk, -
publicmm 
boolmm 
?mm 
isExcelmm 
{mm 
getmm "
;mm" #
setmm$ '
;mm' (
}mm) *
publicoo 
intoo 
?oo 
createByRoleIdoo "
{oo# $
getoo% (
;oo( )
setoo* -
;oo- .
}oo/ 0
publicqq 
intqq 
?qq 
updateByRoleIdqq "
{qq# $
getqq% (
;qq( )
setqq* -
;qq- .
}qq/ 0
publicss 
intss 
?ss 
deleteByRoleIdss "
{ss# $
getss% (
;ss( )
setss* -
;ss- .
}ss/ 0
publicuu 
intuu 
?uu 
emailTempleteuu !
{uu" #
getuu$ '
;uu' (
setuu) ,
;uu, -
}uu. /
publicww 
intww 
?ww 
fromTimeww 
{ww 
getww "
;ww" #
setww$ '
;ww' (
}ww) *
publicyy 
intyy 
?yy 
toTimeyy 
{yy 
getyy  
;yy  !
setyy" %
;yy% &
}yy' (
[{{ 	
StringLength{{	 
({{ 
$num{{ 
){{ 
]{{ 
public|| 
string|| 
fileName|| 
{||  
get||! $
;||$ %
set||& )
;||) *
}||+ ,
public~~ 
bool~~ 
?~~ 
isEndUserReport~~ $
{~~% &
get~~' *
;~~* +
set~~, /
;~~/ 0
}~~1 2
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
�� 
bool
�� 
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
��C D
public
�� 
virtual
�� 
ICollection
�� "
<
��" ##
reportmasterparameter
��# 8
>
��8 9$
reportmasterparameters
��: P
{
��Q R
get
��S V
;
��V W
set
��X [
;
��[ \
}
��] ^
}
�� 
}�� �
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\reportmasterparameter.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\reportviewerparameter.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
PD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\report_change_logs.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
^D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\report_parameter_setting_mapping.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
	isDeleted$$ 
{$$ 
get$$  #
;$$# $
set$$% (
;$$( )
}$$* +
public&& 
bool&& 
	isDisplay&& 
{&& 
get&&  #
;&&# $
set&&% (
;&&( )
}&&* +
public(( 
decimal(( 
displayOrder(( #
{(($ %
get((& )
;(() *
set((+ .
;((. /
}((0 1
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
QD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\Systemconfigrations.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
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
}<< �(
CD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\MySqlDBModel\users.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 
MySqlDBModel )
{ 
public		 

class		 
users		 
{

 
[ 	
Key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
username 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
passwordDigest $
{% &
get' *
;* +
set, /
;/ 0
}1 2
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
emailAddress "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	firstName 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
lastName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
	updatedAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
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
bool,, 
?,, 
	isDeleted,, 
{,,  
get,,! $
;,,$ %
set,,& )
;,,) *
},,+ ,
[.. 	
StringLength..	 
(.. 
$num.. 
).. 
].. 
public// 
string// 
onlineStatus// "
{//# $
get//% (
;//( )
set//* -
;//- .
}/// 0
public11 
int11 
?11 

employeeID11 
{11  
get11! $
;11$ %
set11& )
;11) *
}11+ ,
public33 
Guid33 
?33 
forGotPasswordToken33 (
{33) *
get33+ .
;33. /
set330 3
;333 4
}335 6
public55 
DateTime55 
?55 #
tokenGenerationDateTime55 0
{551 2
get553 6
;556 7
set558 ;
;55; <
}55= >
public77 
int77 
?77 
	printerID77 
{77 
get77  #
;77# $
set77% (
;77( )
}77* +
public99 
int99 
?99 
defaultLoginRoleID99 &
{99' (
get99) ,
;99, -
set99. 1
;991 2
}993 4
public;; 
int;; 
?;; 
createByRoleId;; "
{;;# $
get;;% (
;;;( )
set;;* -
;;;- .
};;/ 0
public== 
int== 
?== 
updateByRoleId== "
{==# $
get==% (
;==( )
set==* -
;==- .
}==/ 0
public?? 
int?? 
??? 
deleteByRoleId?? "
{??# $
get??% (
;??( )
set??* -
;??- .
}??/ 0
[AA 	
StringLengthAA	 
(AA 
$numAA 
)AA 
]AA 
publicBB 
stringBB 
IdentityUserIdBB $
{BB% &
getBB' *
;BB* +
setBB, /
;BB/ 0
}BB1 2
}CC 
}DD �
8D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Program.cs
	namespace 	
FJT
 
. 
ReportDesigner 
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
. 
AddJsonFile 
( 
$str .
). /
. 
Build 
( 
) 
; 
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
CreateHostBuilder !
(! "
args" &
)& '
.' (
Build( -
(- .
). /
./ 0
Run0 3
(3 4
)4 5
;5 6
} 
catch 
( 
	Exception 
ex 
)  
{ 
Log 
. 
Fatal 
( 
ex 
, 
$str ;
); <
;< =
}   
finally!! 
{"" 
Log## 
.## 
CloseAndFlush## !
(##! "
)##" #
;### $
}$$ 
}%% 	
public'' 
static'' 
IHostBuilder'' "
CreateHostBuilder''# 4
(''4 5
string''5 ;
[''; <
]''< =
args''> B
)''B C
=>''D F
Host(( 
.((  
CreateDefaultBuilder(( %
(((% &
args((& *
)((* +
.)) 

UseSerilog)) #
())# $
)))$ %
.** $
ConfigureWebHostDefaults** )
(**) *

webBuilder*** 4
=>**5 7
{++ 

webBuilder,, 
.,, 

UseStartup,, )
<,,) *
Startup,,* 1
>,,1 2
(,,2 3
),,3 4
;,,4 5
}11 
)11 
;11 
}22 
}33 �
QD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\DynamicMessageService.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
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
private 
readonly 
IMongoDBContext (
_mongoDBContext) 8
;8 9
public !
DynamicMessageService $
($ %
IOptions% -
<- .
MongoDBConfig. ;
>; <
mongoDBConfig= J
,J K
IMongoDBContextL [
mongoDBContext\ j
)j k
{ 	
_mongoDBContext 
= 
mongoDBContext ,
;, -
_mongoCollections 
= 
mongoDBConfig  -
.- .
Value. 3
.3 4
MongoCollections4 D
;D E
var 
	dbContext 
= 
_mongoDBContext +
.+ ,
GetDBContext, 8
(8 9
)9 :
;: ;
_dynamicMessages 
= 
	dbContext (
.( )
GetCollection) 6
<6 7
DynamicMessage7 E
>E F
(F G
_mongoCollectionsG X
.X Y(
DynamicMessageCollectionNameY u
)u v
;v w
} 	
public!! 
async!! 
Task!! 
<!! 
DynamicMessage!! (
>!!( )
Get!!* -
(!!- .
string!!. 4

messageKey!!5 ?
)!!? @
=>!!A C
await"" 
_dynamicMessages"" %
.""% &
Find""& *
(""* +
x""+ ,
=>""- /
x""0 1
.""1 2

messageKey""2 <
==""= ?

messageKey""@ J
&&""K M
x""N O
.""O P
	isDeleted""P Y
==""Z \
false""] b
)""b c
.""c d
FirstOrDefaultAsync""d w
(""w x
)""x y
??""z |
new	""} �
DynamicMessage
""� �
{
""� �
messageType
""� �
=
""� �
$str
""� �
,
""� �
message
""� �
=
""� �
ConstantHelper
""� �
.
""� �&
MONGODB_CONNECTION_ERROR
""� �
}
""� �
;
""� �
}$$ 
}%% �0
SD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\HttpsResponseRepository.cs
	namespace

 	
FJT


 
.

 
ReportDesigner

 
.

 

Repository

 '
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
\D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IDynamicMessageService.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 "
IDynamicMessageService		 +
{

 
public 
Task 
< 
DynamicMessage !
>! "
Get# &
(& '
string' -

messageKey. 8
)8 9
;9 :
} 
} �
^D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IHttpsResponseRepository.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
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
UD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IMongoDBContext.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
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
} �
XD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\Interface\IUtilityController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 
IUtilityController		 '
{

 
public 
ResponseModel #
CheckStatusOfReportFile 4
(4 5
string5 ;
fileName< D
,D E
boolF J
isEndUserReportK Z
,Z [
string\ b 
reportGenerationTypec w
)w x
;x y
public 
Task 
< 
ResponseModel !
>! "
GetReportByteData# 4
(4 5
string5 ;
fileName< D
,D E
boolF J
isEndUserReportK Z
,Z [
string\ b 
reportGenerationTypec w
)w x
;x y
} 
} �

JD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\MongoDBContext.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
{ 
public 

class 
MongoDBContext 
:  !
IMongoDBContext" 1
{ 
private 
readonly 
MongoDBConfig &
_mongoDBConfig' 5
;5 6
public 
MongoDBContext 
( 
IOptions &
<& '
MongoDBConfig' 4
>4 5
mongoDBConfig6 C
)C D
{ 	
_mongoDBConfig 
= 
mongoDBConfig *
.* +
Value+ 0
;0 1
} 	
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
{ 	
var 
client 
= 
new 
MongoClient (
(( )
_mongoDBConfig) 7
.7 8#
MongoDBConnectionString8 O
)O P
;P Q
return 
client 
. 
GetDatabase %
(% &
_mongoDBConfig& 4
.4 5
DBName5 ;
); <
;< =
} 	
} 
} ��
MD:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Repository\UtilityController.cs
	namespace 	
FJT
 
. 
ReportDesigner 
. 

Repository '
{ 
public 

class 
UtilityController "
:# $

Controller% /
,/ 0
IUtilityController1 C
{ 
	protected 
readonly 
FJTSqlDBContext *
_FJTSqlDBContext+ ;
;; <
	protected 
ConstantPath 
_constantPath ,
;, -
	protected  
IdentityserverConfig &!
_identityserverConfig' <
;< =
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
private 
readonly 
ILogger  
<  !
UtilityController! 2
>2 3
_logger4 ;
;; <
public 
UtilityController  
(  !
FJTSqlDBContext! 0
fjtSqlDBContext1 @
,@ A
IOptionsB J
<J K
ConstantPathK W
>W X
constantPathY e
,e f
IOptionsg o
<o p!
IdentityserverConfig	p �
>
� �"
identityserverConfig
� �
,
� �$
IDynamicMessageService
� �#
dynamicMessageService
� �
,
� �
ILogger
� �
<
� �
UtilityController
� �
>
� �
logger
� �
)
� �
{ 	
_FJTSqlDBContext   
=   
fjtSqlDBContext   .
;  . /
_constantPath!! 
=!! 
constantPath!! (
.!!( )
Value!!) .
;!!. /!
_identityserverConfig"" !
=""" # 
identityserverConfig""$ 8
.""8 9
Value""9 >
;""> ?"
_dynamicMessageService## "
=### $!
dynamicMessageService##% :
;##: ;
_logger$$ 
=$$ 
logger$$ 
;$$ 
}%% 	
['' 	
	Authorize''	 
('' !
AuthenticationSchemes'' (
='') *
JwtBearerDefaults''+ <
.''< = 
AuthenticationScheme''= Q
)''Q R
]''R S
public(( 
ResponseModel(( #
CheckStatusOfReportFile(( 4
(((4 5
string((5 ;
fileName((< D
,((D E
bool((F J
isEndUserReport((K Z
,((Z [
string((\ b 
reportGenerationType((c w
)((w x
{)) 	
if** 
(** 
fileName** 
==** 
null**  
)**  !
{++ 
var,, 
invalidParameterMSG,, '
=,,( )"
_dynamicMessageService,,* @
.,,@ A
Get,,A D
(,,D E
INVALID_PARAMETER,,E V
),,V W
.,,W X
Result,,X ^
;,,^ _
return-- 
new-- 
ResponseModel-- (
(--( )
)--) *
{--+ ,
	IsSuccess--- 6
=--7 8
false--9 >
,--> ?

StatusCode--@ J
=--K L
(--M N
int--N Q
)--Q R
APIStatusCode--R _
.--_ `
BAD_REQUEST--` k
,--k l
Message--m t
=--u v 
invalidParameterMSG	--w �
.
--� �
message
--� �
}
--� �
;
--� �
}.. 
try// 
{00 
var11 !
isReportFileAvailable11 )
=11* +
false11, 1
;111 2
var22 
reportFolderPath22 $
=22% &
isEndUserReport22' 6
?227 8
_constantPath229 F
.22F G

ReportPath22G Q
:22R S
(22T U 
reportGenerationType22U i
==22j l
(22m n
(22n o
int22o r
)22r s
ReportCategory	22s �
.
22� �#
SystemGeneratedReport
22� �
)
22� �
.
22� �
ToString
22� �
(
22� �
)
22� �
?
22� �
_constantPath
22� �
.
22� �'
SystemGeneratedReportPath
22� �
:
22� �
_constantPath
22� �
.
22� � 
TemplateReportPath
22� �
)
22� �
;
22� �
var33 

reportPath33 
=33  
reportFolderPath33! 1
+332 3
fileName334 <
+33= >
ConstantHelper33? M
.33M N
REPORT_EXTENSION33N ^
;33^ _
if55 
(55 
System55 
.55 
IO55 
.55 
File55 "
.55" #
Exists55# )
(55) *

reportPath55* 4
)554 5
)555 6
{66 !
isReportFileAvailable77 )
=77* +
true77, 0
;770 1
}88 
return:: 
new:: 
ResponseModel:: (
(::( )
)::) *
{::+ ,
	IsSuccess::- 6
=::7 8
true::9 =
,::= >
Model::? D
=::E F!
isReportFileAvailable::G \
,::\ ]

StatusCode::^ h
=::i j
(::k l
int::l o
)::o p
APIStatusCode::p }
.::} ~
SUCCESS	::~ �
,
::� �
Message
::� �
=
::� �
null
::� �
}
::� �
;
::� �
};; 
catch<< 
(<< 
	Exception<< 
e<< 
)<< 
{== 
_logger>> 
.>> 
LogError>>  
(>>  !
e>>! "
.>>" #
ToString>># +
(>>+ ,
)>>, -
)>>- .
;>>. /
return?? 
new?? 
ResponseModel?? (
(??( )
)??) *
{??+ ,
	IsSuccess??- 6
=??7 8
false??9 >
,??> ?
Model??@ E
=??F G
null??H L
,??L M

StatusCode??N X
=??Y Z
(??[ \
int??\ _
)??_ `
APIStatusCode??` m
.??m n"
INTERNAL_SERVER_ERROR	??n �
,
??� �
Message
??� �
=
??� �
e
??� �
.
??� �
Message
??� �
}
??� �
;
??� �
}@@ 
}AA 	
[CC 	
	AuthorizeCC	 
(CC !
AuthenticationSchemesCC (
=CC) *
JwtBearerDefaultsCC+ <
.CC< = 
AuthenticationSchemeCC= Q
)CCQ R
]CCR S
publicDD 
asyncDD 
TaskDD 
<DD 
ResponseModelDD '
>DD' (
GetReportByteDataDD) :
(DD: ;
stringDD; A
fileNameDDB J
,DDJ K
boolDDL P
isEndUserReportDDQ `
,DD` a
stringDDb h 
reportGenerationTypeDDi }
)DD} ~
{EE 	
ifFF 
(FF 
fileNameFF 
==FF 
nullFF  
)FF  !
{GG 
varHH 
invalidParameterMSGHH '
=HH( )"
_dynamicMessageServiceHH* @
.HH@ A
GetHHA D
(HHD E
INVALID_PARAMETERHHE V
)HHV W
.HHW X
ResultHHX ^
;HH^ _
returnII 
newII 
ResponseModelII (
(II( )
)II) *
{II+ ,
	IsSuccessII- 6
=II7 8
falseII9 >
,II> ?

StatusCodeII@ J
=IIK L
(IIM N
intIIN Q
)IIQ R
APIStatusCodeIIR _
.II_ `
BAD_REQUESTII` k
,IIk l
MessageIIm t
=IIu v 
invalidParameterMSG	IIw �
.
II� �
message
II� �
}
II� �
;
II� �
}JJ 
tryKK 
{LL 
varMM 
reportFolderPathMM $
=MM% &
isEndUserReportMM' 6
?MM7 8
_constantPathMM9 F
.MMF G

ReportPathMMG Q
:MMR S
(MMT U 
reportGenerationTypeMMU i
==MMj l
(MMm n
(MMn o
intMMo r
)MMr s
ReportCategory	MMs �
.
MM� �#
SystemGeneratedReport
MM� �
)
MM� �
.
MM� �
ToString
MM� �
(
MM� �
)
MM� �
?
MM� �
_constantPath
MM� �
.
MM� �'
SystemGeneratedReportPath
MM� �
:
MM� �
_constantPath
MM� �
.
MM� � 
TemplateReportPath
MM� �
)
MM� �
;
MM� �
varNN 

reportPathNN 
=NN  
reportFolderPathNN! 1
+NN2 3
fileNameNN4 <
+NN= >
ConstantHelperNN? M
.NNM N
REPORT_EXTENSIONNNN ^
;NN^ _
ReportByteDataVMPP  
reportByteDataVMPP! 1
=PP2 3
newPP4 7
ReportByteDataVMPP8 H
{QQ 
ReportByteDataRR "
=RR# $
awaitRR% *
SystemRR+ 1
.RR1 2
IORR2 4
.RR4 5
FileRR5 9
.RR9 :
ReadAllBytesAsyncRR: K
(RRK L

reportPathRRL V
)RRV W
}SS 
;SS 
varTT "
reportByteDataVMStringTT *
=TT+ ,

NewtonsoftTT- 7
.TT7 8
JsonTT8 <
.TT< =
JsonConvertTT= H
.TTH I
SerializeObjectTTI X
(TTX Y
reportByteDataVMTTY i
)TTi j
;TTj k
returnVV 
newVV 
ResponseModelVV (
(VV( )
)VV) *
{VV+ ,
	IsSuccessVV- 6
=VV7 8
trueVV9 =
,VV= >
ModelVV? D
=VVE F"
reportByteDataVMStringVVG ]
,VV] ^

StatusCodeVV_ i
=VVj k
(VVl m
intVVm p
)VVp q
APIStatusCodeVVq ~
.VV~ 
SUCCESS	VV �
,
VV� �
Message
VV� �
=
VV� �
null
VV� �
}
VV� �
;
VV� �
}WW 
catchXX 
(XX 
	ExceptionXX 
eXX 
)XX 
{YY 
_loggerZZ 
.ZZ 
LogErrorZZ  
(ZZ  !
eZZ! "
.ZZ" #
ToStringZZ# +
(ZZ+ ,
)ZZ, -
)ZZ- .
;ZZ. /
return[[ 
new[[ 
ResponseModel[[ (
([[( )
)[[) *
{[[+ ,
	IsSuccess[[- 6
=[[7 8
false[[9 >
,[[> ?
Model[[@ E
=[[F G
null[[H L
,[[L M

StatusCode[[N X
=[[Y Z
([[[ \
int[[\ _
)[[_ `
APIStatusCode[[` m
.[[m n"
INTERNAL_SERVER_ERROR	[[n �
,
[[� �
Message
[[� �
=
[[� �
e
[[� �
.
[[� �
Message
[[� �
}
[[� �
;
[[� �
}\\ 
}]] 	
public__ 
async__ 
Task__ 
<__ 
double__  
>__  !

RenewToken__" ,
(__, -
)__- .
{`` 	
tryaa 
{bb 
varcc 
authInfocc 
=cc 
awaitcc $
HttpContextcc% 0
.cc0 1
AuthenticateAsynccc1 B
(ccB C!
_identityserverConfigccC X
.ccX Y 
AuthenticationSchemeccY m
)ccm n
;ccn o
ifdd 
(dd 
authInfodd 
==dd 
nulldd  $
)dd$ %
{dd& '
returndd( .
$numdd/ 0
;dd0 1
}dd2 3
varff 
refreshTokenff  
=ff! "
authInfoff# +
.ff+ ,

Propertiesff, 6
.ff6 7
GetTokenValueff7 D
(ffD E
$strffE T
)ffT U
;ffU V
vargg 
accessTokengg 
=gg  !
authInfogg" *
.gg* +

Propertiesgg+ 5
.gg5 6
GetTokenValuegg6 C
(ggC D
$strggD R
)ggR S
;ggS T
ifhh 
(hh 
refreshTokenhh  
==hh! #
nullhh$ (
||hh) +
accessTokenhh, 7
==hh8 :
nullhh; ?
)hh? @
{hhA B
returnhhC I
$numhhJ K
;hhK L
}hhM N
varii 
decodedAccessTokenii &
=ii' (
newii) ,#
JwtSecurityTokenHandlerii- D
(iiD E
)iiE F
.iiF G
ReadJwtTokeniiG S
(iiS T
accessTokeniiT _
)ii_ `
;ii` a
varkk 
nowkk 
=kk 
DateTimekk "
.kk" #
UtcNowkk# )
;kk) *
varll 
timeElapsedll 
=ll  !
nowll" %
.ll% &
Subtractll& .
(ll. /
decodedAccessTokenll/ A
.llA B
PayloadllB I
.llI J
	ValidFromllJ S
)llS T
;llT U
varmm 
timeRemainingmm !
=mm" #
decodedAccessTokenmm$ 6
.mm6 7
Payloadmm7 >
.mm> ?
ValidTomm? F
.mmF G
SubtractmmG O
(mmO P
nowmmP S
)mmS T
;mmT U
varnn 
tokenLifeTimenn !
=nn" #
decodedAccessTokennn$ 6
.nn6 7
Payloadnn7 >
.nn> ?
ValidTonn? F
.nnF G
SubtractnnG O
(nnO P
decodedAccessTokennnP b
.nnb c
Payloadnnc j
.nnj k
	ValidFromnnk t
)nnt u
.nnu v
TotalMilliseconds	nnv �
;
nn� �
varoo 
setIntervalTimeoo #
=oo$ %
Mathoo& *
.oo* +
Flooroo+ 0
(oo0 1
tokenLifeTimeoo1 >
/oo? @
$numooA B
)ooB C
;ooC D
ifqq 
(qq 
timeElapsedqq 
>qq  !
timeRemainingqq" /
)qq/ 0
{rr 
HttpClientHandlerss %
handlerss& -
=ss. /
newss0 3
HttpClientHandlerss4 E
{tt 5
)ServerCertificateCustomValidationCallbackuu A
=uuB C
(uuD E
httpRequestMessageuuE W
,uuW X
certuuY ]
,uu] ^
cetChainuu_ g
,uug h
policyErrorsuui u
)uuu v
=>uuw y
{uuz {
return	uu| �
true
uu� �
;
uu� �
}
uu� �
}vv 
;vv 

HttpClientww 
clientww %
=ww& '
Startupww( /
.ww/ 0
islocalhostww0 ;
?ww< =
newww> A

HttpClientwwB L
(wwL M
handlerwwM T
)wwT U
:wwV W
newwwX [

HttpClientww\ f
(wwf g
)wwg h
;wwh i
varyy 
responseyy  
=yy! "
awaityy# (
clientyy) /
.yy/ 0$
RequestRefreshTokenAsyncyy0 H
(yyH I
newyyI L
RefreshTokenRequestyyM `
{zz 
Address{{ 
={{  !
_constantPath{{" /
.{{/ 0
IdentityserverURL{{0 A
+{{B C
ConstantHelper{{D R
.{{R S

TOKEN_PATH{{S ]
,{{] ^
ClientId||  
=||! "!
_identityserverConfig||# 8
.||8 9
ClientId||9 A
,||A B
ClientSecret}} $
=}}% &!
_identityserverConfig}}' <
.}}< =
ClientSecret}}= I
,}}I J
RefreshToken~~ $
=~~% &
refreshToken~~' 3
} 
) 
; 
if
�� 
(
�� 
!
�� 
response
�� !
.
��! "
IsError
��" )
)
��) *
{
�� 
authInfo
��  
.
��  !

Properties
��! +
.
��+ ,
UpdateTokenValue
��, <
(
��< =
$str
��= K
,
��K L
response
��M U
.
��U V
AccessToken
��V a
)
��a b
;
��b c
authInfo
��  
.
��  !

Properties
��! +
.
��+ ,
UpdateTokenValue
��, <
(
��< =
$str
��= L
,
��L M
response
��N V
.
��V W
RefreshToken
��W c
)
��c d
;
��d e
authInfo
��  
.
��  !

Properties
��! +
.
��+ ,
UpdateTokenValue
��, <
(
��< =
$str
��= G
,
��G H
response
��I Q
.
��Q R
IdentityToken
��R _
)
��_ `
;
��` a
}
�� 
else
�� 
{
�� 
_logger
�� 
.
��  
LogError
��  (
(
��( )
$str
��) F
+
��G H
response
��I Q
.
��Q R
Error
��R W
+
��X Y
$str
��Z ^
+
��_ `
response
��a i
.
��i j
ErrorDescription
��j z
)
��z {
;
��{ |
}
�� 
return
�� 
response
�� #
.
��# $
IsError
��$ +
?
��, -
$num
��. /
:
��0 1
setIntervalTime
��2 A
;
��A B
}
�� 
return
�� 
setIntervalTime
�� &
;
��& '
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
��. /
return
�� 
$num
�� 
;
�� 
}
�� 
}
�� 	
}
�� 
}�� �
8D:\Development\FJT\FJT-DEV\FJT.ReportDesigner\Startup.cs
	namespace 	
FJT
 
. 
ReportDesigner 
{ 
public 

class 
Startup 
{ 
public 
Startup 
( 
IConfiguration %
configuration& 3
)3 4
{ 	
Configuration 
= 
configuration )
;) *$
IdentityModelEventSource $
.$ %
ShowPII% ,
=- .
true/ 3
;3 4
} 	
public 
IConfiguration 
Configuration +
{, -
get. 1
;1 2
}3 4
public   
static   
string   
IdentityServerURL   .
{  / 0
get  1 4
;  4 5
set  6 9
;  9 :
}  ; <
public!! 
static!! 
bool!! 
IsDevelopmentMode!! ,
{!!- .
get!!/ 2
;!!2 3
set!!4 7
;!!7 8
}!!9 :
public"" 
static"" 
bool"" 
islocalhost"" &
{""' (
get"") ,
;"", -
set"". 1
;""1 2
}""3 4
public## 
static## 
string## 
ClientId## %
{##& '
get##( +
;##+ ,
set##- 0
;##0 1
}##2 3
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
.++ 
IsDevelopmentMode++ %
=++& '
(++( )
bool++) -
)++- .
Configuration++. ;
.++; <
GetValue++< D
(++D E
typeof++E K
(++K L
bool++L P
)++P Q
,++Q R
$str++S f
)++f g
;++g h
Startup,, 
.,, 
ClientId,, 
=,,  
identityserverConfig,, 3
.,,3 4
GetValue,,4 <
(,,< =
typeof,,= C
(,,C D
string,,D J
),,J K
,,,K L
$str,,M W
),,W X
.,,X Y
ToString,,Y a
(,,a b
),,b c
;,,c d
services.. 
... 
AddCors.. 
(.. 
options.. $
=>..% '
{// 
options00 
.00 
	AddPolicy00 %
(00% &
$str00& 2
,002 3
builder11 
=>11  "
builder11# *
.11* +
AllowAnyOrigin11+ 9
(119 :
)11: ;
.22 
AllowAnyMethod22 +
(22+ ,
)22, -
.33 
AllowAnyHeader33 +
(33+ ,
)33, -
)33- .
;33. /
}44 
)44 
;44 
services55 
.55 #
AddControllersWithViews55 ,
(55, -
)55- .
;55. /
string77 
mySqlConnectionStr77 %
=77& '
Configuration77( 5
.775 6
GetConnectionString776 I
(77I J
$str77J ]
)77] ^
;77^ _
services88 
.88 
AddDbContextPool88 %
<88% &
FJTSqlDBContext88& 5
>885 6
(886 7
options887 >
=>88? A
options88B I
.88I J
UseMySql88J R
(88R S
mySqlConnectionStr88S e
,88e f
ServerVersion88g t
.88t u

AutoDetect88u 
(	88 � 
mySqlConnectionStr
88� �
)
88� �
)
88� �
)
88� �
;
88� �
services:: 
.:: %
AddDistributedMemoryCache:: .
(::. /
)::/ 0
;::0 1
services;; 
.;; 

AddSession;; 
(;;  
options;;  '
=>;;( *
{<< 
options== 
.== 
IdleTimeout== #
===$ %
TimeSpan==& .
.==. /
FromMinutes==/ :
(==: ;
$num==; <
)==< =
;=== >
}>> 
)>> 
;>> 
servicesAA 
.AA 
	ConfigureAA 
<AA 
MongoDBConfigAA ,
>AA, -
(AA- .
ConfigurationAA. ;
.AA; <

GetSectionAA< F
(AAF G
nameofAAG M
(AAM N
MongoDBConfigAAN [
)AA[ \
)AA\ ]
)AA] ^
;AA^ _
servicesBB 
.BB 
	ConfigureBB 
<BB 
ConnectionStringsBB 0
>BB0 1
(BB1 2
ConfigurationBB2 ?
.BB? @

GetSectionBB@ J
(BBJ K
nameofBBK Q
(BBQ R
ConnectionStringsBBR c
)BBc d
)BBd e
)BBe f
;BBf g
servicesCC 
.CC 
	ConfigureCC 
<CC 
ConstantPathCC +
>CC+ ,
(CC, -
ConfigurationCC- :
.CC: ;

GetSectionCC; E
(CCE F
nameofCCF L
(CCL M
ConstantPathCCM Y
)CCY Z
)CCZ [
)CC[ \
;CC\ ]
servicesDD 
.DD 
	ConfigureDD 
<DD  
IdentityserverConfigDD 3
>DD3 4
(DD4 5
ConfigurationDD5 B
.DDB C

GetSectionDDC M
(DDM N
nameofDDN T
(DDT U 
IdentityserverConfigDDU i
)DDi j
)DDj k
)DDk l
;DDl m
servicesGG 
.GG 
	AddScopedGG 
<GG 
IMongoDBContextGG .
,GG. /
MongoDBContextGG0 >
>GG> ?
(GG? @
)GG@ A
;GGA B
servicesHH 
.HH 
	AddScopedHH 
<HH "
IDynamicMessageServiceHH 5
,HH5 6!
DynamicMessageServiceHH7 L
>HHL M
(HHM N
)HHN O
;HHO P
servicesII 
.II 
	AddScopedII 
<II 
IUtilityControllerII 1
,II1 2
UtilityControllerII3 D
>IID E
(IIE F
)IIF G
;IIG H
servicesJJ 
.JJ 
	AddScopedJJ 
<JJ $
IHttpsResponseRepositoryJJ 7
,JJ7 8#
HttpsResponseRepositoryJJ9 P
>JJP Q
(JJQ R
)JJR S
;JJS T
StartupNN 
.NN 
islocalhostNN 
=NN  !
(NN" #
boolNN# '
)NN' (
ConfigurationNN( 5
.NN5 6
GetValueNN6 >
(NN> ?
typeofNN? E
(NNE F
boolNNF J
)NNJ K
,NNK L
$strNNM Z
)NNZ [
;NN[ \
servicesOO 
.OO 
AddAuthenticationOO &
(OO& '
$strOO' /
)OO/ 0
.PP 
AddJwtBearerPP 
(PP 
$strPP &
,PP& '
optionsPP( /
=>PP0 2
{QQ 
ifRR 
(RR 
islocalhostRR #
)RR# $
{SS 
optionsTT 
.TT  "
BackchannelHttpHandlerTT  6
=TT7 8
newTT9 <
HttpClientHandlerTT= N
{TTO P5
)ServerCertificateCustomValidationCallbackTTQ z
=TT{ |
delegate	TT} �
{
TT� �
return
TT� �
true
TT� �
;
TT� �
}
TT� �
}
TT� �
;
TT� �
}UU 
optionsVV 
.VV 
	AuthorityVV %
=VV& '
constantPathVV( 4
.VV4 5
GetValueVV5 =
(VV= >
typeofVV> D
(VVD E
stringVVE K
)VVK L
,VVL M
$strVVN a
)VVa b
.VVb c
ToStringVVc k
(VVk l
)VVl m
;VVm n
optionsWW 
.WW %
TokenValidationParametersWW 5
=WW6 7
newWW8 ;%
TokenValidationParametersWW< U
{XX 
ValidateAudienceYY (
=YY) *
falseYY+ 0
}ZZ 
;ZZ 
}[[ 
)[[ 
;[[ 
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
}cc 
)cc 
.cc 
	AddCookiecc 
(cc  
authenticationSchemecc -
,cc- .
optionscc/ 6
=>cc7 9
{dd 
optionsee 
.ee 
ExpireTimeSpanee &
=ee' (
TimeSpanee) 1
.ee1 2
FromDaysee2 :
(ee: ;
$numee; =
)ee= >
;ee> ?
optionsff 
.ff 
SlidingExpirationff )
=ff* +
trueff, 0
;ff0 1
optionsgg 
.gg 
SessionStoregg $
=gg% &
newgg' *"
MemoryCacheTicketStoregg+ A
(ggA B
)ggB C
;ggC D
}hh 
)hh 
.ii 
AddOpenIdConnectii 
(ii  
ConstantHelperii  .
.ii. /3
'AUTHENTICATION_DEFAULT_CHALLENGE_SCHEMEii/ V
,iiV W
optionsiiX _
=>ii` b
{jj 
ifkk 
(kk 
islocalhostkk !
)kk! "
{ll 
optionsmm 
.mm "
BackchannelHttpHandlermm 4
=mm5 6
newmm7 :
HttpClientHandlermm; L
{mmM N5
)ServerCertificateCustomValidationCallbackmmO x
=mmy z
delegate	mm{ �
{
mm� �
return
mm� �
true
mm� �
;
mm� �
}
mm� �
}
mm� �
;
mm� �
}nn 
optionsoo 
.oo 
	Authorityoo #
=oo$ %
constantPathoo& 2
.oo2 3
GetValueoo3 ;
(oo; <
typeofoo< B
(ooB C
stringooC I
)ooI J
,ooJ K
$strooL _
)oo_ `
.oo` a
ToStringooa i
(ooi j
)ooj k
;ook l
optionspp 
.pp 
ClientIdpp "
=pp# $ 
identityserverConfigpp% 9
.pp9 :
GetValuepp: B
(ppB C
typeofppC I
(ppI J
stringppJ P
)ppP Q
,ppQ R
$strppS ]
)pp] ^
.pp^ _
ToStringpp_ g
(ppg h
)pph i
;ppi j
optionsqq 
.qq 
ClientSecretqq &
=qq' ( 
identityserverConfigqq) =
.qq= >
GetValueqq> F
(qqF G
typeofqqG M
(qqM N
stringqqN T
)qqT U
,qqU V
$strqqW e
)qqe f
.qqf g
ToStringqqg o
(qqo p
)qqp q
;qqq r
optionsss 
.ss 
ResponseTypess &
=ss' (
$strss) /
;ss/ 0
optionstt 
.tt 
UsePkcett !
=tt" #
truett$ (
;tt( )
optionsvv 
.vv 
CallbackPathvv &
=vv' (
$strvv) :
;vv: ;
optionsww 
.ww 
Scopeww 
.ww  
Addww  #
(ww# $
$strww$ ,
)ww, -
;ww- .
optionsxx 
.xx 
Scopexx 
.xx  
Addxx  #
(xx# $
$strxx$ -
)xx- .
;xx. /
optionsyy 
.yy 
Scopeyy 
.yy  
Addyy  #
(yy# $
$stryy$ 7
)yy7 8
;yy8 9
optionszz 
.zz 
Scopezz 
.zz  
Addzz  #
(zz# $
$strzz$ 7
)zz7 8
;zz8 9
options{{ 
.{{ 
Scope{{ 
.{{  
Add{{  #
({{# $
$str{{$ 4
){{4 5
;{{5 6
options|| 
.|| !
SignedOutCallbackPath|| /
=||0 1
$str||2 >
;||> ?
options}} 
.}} 

SaveTokens}} $
=}}% &
true}}' +
;}}+ ,
options~~ 
.~~ 
Events~~  
=~~! "
new~~# &
OpenIdConnectEvents~~' :
{ 
OnTokenValidated
�� &
=
��' (
x
��) *
=>
��+ -
{
�� 
var
�� 
identity
�� &
=
��' (
(
��) *
ClaimsIdentity
��* 8
)
��8 9
x
��9 :
.
��: ;
	Principal
��; D
.
��D E
Identity
��E M
;
��M N
identity
�� "
.
��" #
	AddClaims
��# ,
(
��, -
new
��- 0
[
��0 1
]
��1 2
{
�� 
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
�� 
.
�� 

Properties
�� &
.
��& '
IsPersistent
��' 3
=
��4 5
true
��6 :
;
��: ;
return
��  
Task
��! %
.
��% &
CompletedTask
��& 3
;
��3 4
}
�� 
}
�� 
;
�� 
}
�� 
)
�� 
;
�� 
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
��( 9
)
��9 :
;
��: ;
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
�� I
)
��I J
;
��J K
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
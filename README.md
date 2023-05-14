# Mini-Lisp 编程语言规范

<div style="display: flex; justify-content: center">

> **版本 20230426** [谷雨同学](https://guyutongxue.site)制订

</div>

## 概述

### 综述

此文档定义 Mini-Lisp 编程语言。Mini-Lisp 是一种以教学为目的的编程语言，接近于 Scheme R<sup>5</sup>RS 规范的子集。

符合本文档所定义的 Mini-Lisp 编程语言的文本称为 Mini-Lisp *程序*。

此文档规定 Mini-Lisp *实现* 的行为。*实现* 是指解释 Mini-Lisp 编程语言为一系列若干计算机操作的计算机程序，也可称作解释器或解释程序。实现解释程序的过程称为*解释流程*。

### 记号与术语

#### 语言实现规定

本文档所定义的所有标识符出现在若干 *库* 中。*库* 既包含核心语法，也包含有用的、用于操作数据的过程。

本文档所述 *实现定义*，即实现方可以以任何符合本文档描述的形式实现。建议实现方提供文档以说明相关行为。

所有 Mini-Lisp 的实现：
- 必须提供本文档所描述的所有库中导出的标识符；
- 可以提供不在本文档描述的库之外的标识符；
- 对于本文档所定义的标识符，可以提供额外的功能，但禁止与本文档所述的内容冲突。

#### 错误情形与未定义行为

本文档所述 *错误情形*，是指当本文档使用 *发出错误信号* 这一术语的情形。此时，实现必须报告错误。错误信号被发出时，实现应当表现为 `error` 过程被调用。当数据被 `error` 过程引用时，实现应当报告该数据。报告格式是实现定义的；建议以该数据的外部表示作为报告格式的一部分。

本文档所述 *未定义行为*，是指实现可以在此情形下执行任何操作。

本文档出现的词语 *必须*、*禁止*、*应当*、*不应当*、*可以*、*建议* 和 *可选地*，应采取 RFC 2119 中对术语 `MUST` `MUST NOT` `SHALL` `SHALL NOT` `MAY` `RECOMMENDED` 和 `OPTIONAL` 的定义。

### 凡例

本文档使用如下格式

<space-between>

*模板*

*类别*

</space-between>

来定义条目。

模板中用尖括号 $\lang$ 和 $\rang$ 围起的内容，是语义化的描述。除此之外的所有等宽字体，为按原样描述。记号

> $\lang$ thing<sub>1</sub> $\rang$ ...

代表此处允许出现零或多次 $\lang$ thing $\rang$ 。记号

> $\lang$ thing<sub>1</sub> $\rang$ $\lang$ thing<sub>2</sub> $\rang$ ...

代表此处允许出现一到多次 $\lang$ thing $\rang$ 。

*类别* 可以为 “语法”“辅助语法”“特殊形式”和“过程”。过程描述中，斜体字代表该过程所期望的形参。

形参名具有以下格式时，总是假定它具有相应的类型：
- *boolean* —— 布尔类型；
- *k*，*k*<sub><i>i</i></sub> —— 非负整数类型；
- *list*，*list*<sub><i>i</i></sub> —— 列表类型；
- *n*，*n*<sub><i>i</i></sub> —— 整数类型；
- *pair* —— 对子类型；
- *proc* —— 过程类型；
- *string* —— 字符串类型；
- *symbol* —— 符号类型；
- *x*，*x*<sub><i>i</i></sub>，*y*，*y*<sub><i>i</i></sub> —— 数类型。

在示例代码中，记号 ⇒ 的含义是“的求值结果为”。

> 例如：`(* 5 8) ⇒ 40`

代表表达式 `(* 5 8)` 的求值结果为对象 `40`。准确地说，该表达式在 *默认初始环境* 下求值，得到的结果与程序 `40` 求值的结果恒等。

## 文法定义

### 标识符

*标识符*是指由基本拉丁字母（Unicode 码位 U+0041 至 U+005A；U+0061 至 U+007A）、数字（Unicode 码位 U+0030 至 U+0039）和 *扩展标识符字符* 的并集构成的字符序列。标识符的最小长度为 1，标识符的最大长度是实现定义的，不得低于 16。标识符的首个字符不得是数字。

> 注：允许实现定义扩展，使得标识符的首个字符可以为数字。此时，若标识符文法与数型字面量文法冲突，则行为是实现定义的。

*扩展标识符字符* 是指实现定义的任何字符集合。该集合必须包含如下字符：

| 字符 | Unicode 码位 |
|---|---|
| `!` | U+0021 |
| `$` | U+0024 |
| `%` | U+0025 |
| `&` | U+0026 |
| `*` | U+002A |
| `+` | U+002B |
| `-` | U+002D |
| `.` | U+002E |
| `/` | U+002F |
| `:` | U+003A |
| `<` | U+003C |
| `=` | U+003D |
| `>` | U+003E |
| `?` | U+003F |
| `@` | U+0040 |
| `_` | U+005F |
| `~` | U+007E |

以下具有特殊含义的字符，以及 C0 控制字符（Unicode 码位 U+0000 至 U+001F）不能作为标识符的一部分：

| 字符 | Unicode 码位 |
|---|---|
| ` ` | U+0020 |
| `"` | U+0022 |
| `#` | U+0023 |
| `'` | U+0027 |
| `(` | U+0028 |
| `)` | U+0029 |
| `,` | U+002C |
| `;` | U+003B |
| <code>&#96;</code> | U+0060 |

单独的 `.` 字符（Unicode 码位 U+002E）不能作为标识符。

如果实现定义的语法扩展与实现允许的扩展标识字符产生歧义，则引发未定义行为。

> 注：Mini-Lisp 与 Scheme 及其方言不同，对大小写敏感。

### 空白字符与注释

空白字符指空格（Unicode 码位 U+0020）、制表符（Unicode 码位 U+0009）和操作系统定义的换行符序列中的任何字符。

> 注：此处所述“换行符序列中的任何字符”一般是指换行符（Unicode 码位 U+000A）与回车符（Unicode 码位 U+000D）。是否将非当前操作系统的换行符序列的字符视为空白字符是实现定义的。

> 注：实现可以将其它 Unicode 空白字符视为空白字符。

空白字符用来将 Mini-Lisp 程序分割为若干 *语法标记*。语法标记之间的空白字符数量可以为任意正整数，也可以为空白字符中的任何一种，它们不影响程序的语义。

分号字符（`;`，Unicode 码位 U+003B）视为 *注释* 的起始字符。注释的终止字符为下一组操作系统定义的换行符序列的最后一个字符。注释之中的任何字符在解释期间都应当被忽略。允许实现定义任何其它形式的注释语法，但禁止与本文档所述的语法规则冲突。

### 其它记号

下表给出了 Mini-Lisp 必须实现的其它记号。详细的语法定义将在后文给出。

| 记号 | 含义 |
|---|---|
| 紧跟在数字之前的加号、减号（`+` `-`，Unicode 码位 U+002B U+002D）| 不视为单独的语法标记；将其与随后的数字序列视为数型字面量。 |
| 小括号（`(` `)`，Unicode 码位 U+0028 U+0029） | 用以标记列表的起始位置与终止位置 |
| 单引号（`'`，Unicode 码位 U+0027） | 用以标记字面表达式 |
| 反引号（<code>&#96;</code>，Unicode 码位 U+0060） | 用以标记部分字面表达式 |
| 逗号（`,` Unicode 码位 U+002C） | 用以标记部分字面数据中的求值部分 |
| 双引号（`"`，Unicode 码位 U+0022） | 用以标记字符串字面量的起始位置与终止位置 | 
| 紧跟在字符 `t` `f` 之前的井号（`#`，Unicode 码位 U+0023）| 用以标记布尔字面量 |
| 单独的 `.` 字符（Unicode 码位 U+002E）| 用以标记对子的右半部分 |

> 注：允许实现将 `[` `]` `{` `}` `#` `|` 等符号作为额外的扩展语法。

## 基本概念

### 变量

标识符可以用来指名一片存储空间。此时，称该标识符为 *变量*，其 *绑定* 到了对应的存储空间；此变量到存储空间的映射关系也称为一组 *绑定*。一个变量所绑定的存储空间内的数据称为这个变量的 *值*。

*环境* 是一组绑定构成的集合。环境可选地具有*上级环境*。上级环境不存在当且仅当该环境是 *默认初始环境*。

部分表达式可以创建 *绑定*，如 `define`、`lambda` 和 `let` 特殊形式。

### 数据类型

Mini-Lisp 通过存储空间中数据的 *类型* 来解释其含义。Mini-Lisp 必须包含以下数据类型：

| 类型名 | 判断过程 |
|---|---|
| 空表类型 | `null?` |
| 布尔类型 | `boolean?` |
| 数类型 | `number?` |
| 字符串类型 | `string?` |
| 符号类型 | `symbol?` |
| 过程类型 | `procedure?` |
| 对子类型 | `pair?` |

以上数据类型是排他的：即禁止同一数据在上表中两个或两个以上的过程作用下得到 `#t`。以上数据类型不一定是归一的：允许实现提供额外的数据类型。实现至少应当对这些额外类型的 *外部表示* 予以说明。

> 注：每种数据类型的具体描述见 [§6](#数据)。

### 外部表示

所有数据都存在一种以字符串表示的方法，称为其 *外部表示*。

布尔类型数据的外部表示为 `#t` 或 `#f`，称为 *布尔字面量*。*真值* 用 `#t` 表示，*假值* 用 `#f` 表示。

数字、点号 `.`，以及可选的 `+` 或 `-` 的开头构成的语法标记为 *数型字面量*。
- 对于没有 `.` 的数型字面量，其求值得到通常意义下该记号组成的整数值。
- 对于有 `.` 的数型字面量，其求值得到通常意义下该记号组成的以小数形式写出的有理数值。`.` 字符不应当出现多次。`.` 字符出现在不记前缀 `+` 或 `-` 意义下的开头时，将该有理数值小数形式的整数部分视为 0。
- 以 `+` 开头的数型字面量与不带 `+` 的数型字面量求值为 *相同* 值。
- 以 `-` 开头的数型字面量所表示的值，求值为不带 `-` 的数型字面量的相反数。

本文档提及某数类型数据的外部表示时，实现可选用任何求值为 *相同* 数据的数型字面量作为其外部表示。不推荐实现将整数数据的外部表示记为带有 `.` 的数型字面量。

字符串类型数据的外部表示为一对双引号 `"` 引起的字符序列，称为 *字符串字面量*。双引号内部允许出现任意数量的 *非转义字符* 和 *转义字符序列*。双引号内部的字符数量上限是实现定义的，但禁止超过实现定义的字符串字符数量上限。

*非转义字符* 指除双引号 `"` 和反斜杠（`\`，Unicode 码位 U+0060）的 Unicode 字符。*转义字符序列* 指由反斜杠 `\` 与下列 *转义说明符* 构成的双字符序列：

| 转义说明符 | 指示字符 |
|---|---|
| `t` | 制表符（Unicode 码位 U+0009）|
| `n` | 换行符（Unicode 码位 U+000A）|
| `\` | 反斜杠（Unicode 码位 U+0060）|
| `"` | 双引号（Unicode 码位 U+0022）|

字符串字面量所表示的字符串的字符，由字面量中非转义字符或转义字符序列所 *指示* 的字符，按原有顺序排列构成。非转义字符指示其自身，转义字符序列指示的字符参照上表。实现可以定义其它转义说明符。

符号类型数据的外部表示即为代表该符号的标识符。

对子类型数据的外部表示使用列表或带点列表的外部表示（见 [§6.10](#列表与带点列表)）。

空表的外部表示为 `(` `)`。实现也可以将标识符 `nil` 作为空表类型的外部表示。

进程类型数据的外部表示是实现定义的。建议实现将该表示以 `#` 字符作为开头。

### 存储模型

在某一时刻下，存储空间存在其到变量的绑定时，该存储空间的内容应当可以被合法读取。换而言之，只有当该存储空间不再被任何绑定使用时，才可以非法化（即释放）。

实现可以假设所有的存储空间只会在绑定时被写入（即只读的）。允许实现定义对存储空间的写操作。写操作应当以内置过程的形式提供接口，且该内置过程的默认标识符名称应当以字符 `!`（Unicode 码位 U+0021）结尾。

> 例如：将 `(set! a value)` 定义为重写 `a` 变量的内容为 `value`。

## 表达式

Mini-Lisp 程序由若干 *表达式* 构成。*表达式* 是由一系列语法记号构成的，可以被 *求值* 的程序文本。表达式包括 *初等表达式* 和 *派生表达式* 两个类别。实现可以提供更多的表达式形式。

> 注：表达式通常具有 *列表* 的外部表示形式或字面量形式。

> 注：允许实现提供 *宏* 以及相关的 *特殊形式*。

### 初等表达式

#### 变量引用

<space-between>

$\lang$ 标识符 $\rang$

语法

</space-between>

表达式中出现的标识符即 *变量引用*。对 *变量引用* 求值时，将在当前环境下查找其所绑定的值。如果该标识符没有绑定，则依次查找其上级环境中的绑定；若没有上级环境，则发出错误信号。错误信号中，应当包含该标识符。

> 例如：
> ```scheme
> (define x 28)
> x ⇒ 28
> ```

#### 字面表达式

<space-between>

`(` `quote` $\lang$ 表示 $\rang$ `)`

特殊形式

</space-between>
<space-between>

`'` $\lang$ 表示 $\rang$

语法

</space-between>
<space-between>

$\lang$ 字面量 $\rang$

语法

</space-between>

`(` `quote` $\lang$ 表示 $\rang$ `)` 求值为 $\lang$ 表示 $\rang$。$\lang$ 表示 $\rang$ 可以为任何数据的外部表示。

```scheme
(quote a)        ⇒ a
(quote (+ 1 2))  ⇒ (+ 1 2)
```

`(` `quote` $\lang$ 表示 $\rang$ `)` 可简写为 `'` $\lang$ 表示 $\rang$。

$\lang$ 字面量 $\rang$ 指任何整数字面量、布尔字面量和字符字面量。对这些字面量的求值结果仍为字面量所代表的值。

> 注：对字面量作用 `quote` *特殊形式*与字面量本身是等价的。

```scheme
"abc"   ⇒ "abc"
'"abc"  ⇒ "abc"
'#t     ⇒ #t
#t      ⇒ #t
142857  ⇒ 142857
'142857 ⇒ 142857
```

#### 过程调用

<space-between>

`(` 操作符 $\lang$ 操作数<sub>1</sub> $\rang$ ... `)`

语法

</space-between>

过程调用写作一对小括号。首先，对小括号内的首个表达式求值，得到 *被调方*。随后，其余表达式从前至后依次求值后，做为传入该过程的 *实参*。

```scheme
(+ 3 4)           ⇒ 7
((if #f + *)3 4)  ⇒ 12
```

过程调用求值时 *调用* *被调方*。求值结果为 *被调方* 的 *返回值*。若过程为本文档所定义的库的过程，则 *返回值* 由本文档所定义。

对空列表（即 `(` `)`）求值是未指明行为：要么返回空表，要么发出错误信号。

当 *操作符* 恰为标识符，且与本文档所定义的其它语法相冲突时，遵循相关语法的规定而非视为过程调用。这些语法称为 *特殊形式*。

#### 过程

<space-between>

`(` `lambda` $\lang$ 形参列表 $\rang$ $\lang$ 过程体 $\rang$ `)`

特殊形式

</space-between>

$\lang$ 形参列表 $\rang$ 指代过程的 *形参*。形参列表具有形式 `(` $\lang$ 标识符<sub>1</sub> $\rang$ ... `)`，称为 *一般形参形式*。实现可以提供更多的形参列表形式。$\lang$ 过程体 $\rang$ 为一到多个表达式。

该特殊形式求值得到一个过程类型的数据——*过程*。过程可以被 *调用*。当过程被调用时，发生 *参数绑定*。

参数绑定创建一个新环境，其上级环境定义为该特殊形式定义所在的环境。随后，为此新环境添加变量绑定：对于一般形参形式中的每一个标识符，将其绑定到调用时传入的实参值上。在一般形参形式中，如果形参标识符的数量与实参的数量不符，则发出错误信号。随后，在该新环境下对 $\lang$ 过程体 $\rang$ 的每个表达式进行求值，将最后一个表达式的求值结果作为过程的 *返回值*。最后，恢复到过程调用前的环境。

#### 条件形式

<space-between>

`(` `if` $\lang$ 条件 $\rang$ $\lang$ 真分支 $\rang$ $\lang$ 假分支 $\rang$ `)`

特殊形式

</space-between>

$\lang$ 条件 $\rang$、$\lang$ 真分支 $\rang$ 和 $\lang$ 假分支 $\rang$ 都是表达式。

求值条件形式时，首先对 $\lang$ 条件 $\rang$ 求值。若求值结果为 *虚值*，则求值 $\lang$ 假分支 $\rang$，并将其作为整个形式的求值结果。否则，求值 $\lang$ 真分支 $\rang$，并将其作为整个形式的求值结果。

> 注：实现可以接受忽略 $\lang$ 假分支 $\rang$ 的条件形式。此时，若 $\lang$ 条件 $\rang$ 求值为 *虚值*，则引发未定义行为。建议设置此时的求值结果为空表。

#### 变量定义

<space-between>

`(` `define` $\lang$ 标识符 $\rang$ $\lang$ 初始值 $\rang$ `)`

特殊形式

</space-between>
<space-between>

`(` `define` `(` $\lang$ 标识符 $\rang$ $\lang$ 形参<sub>1</sub> $\rang$ ... `)` $\lang$ 过程体 $\rang$ `)`

特殊形式

</space-between>

$\lang$ 初始值 $\rang$ 是表达式；$\lang$ 形参 $\rang$ 是一系列标识符；$\lang$ 过程体 $\rang$ 是一或多个表达式。

第一种形式的变量定义向环境引入绑定：将 $\lang$ 标识符 $\rang$ 绑定到某存储空间，并令该存储空间存储 $\lang$ 初始值 $\rang$ 求值后的结果。

第二种形式的变量定义等价于 `(` `define` $\lang$ 标识符 $\rang$ `(` `lambda` `(` $\lang$ 形参<sub>1</sub> ... $\rang$ `)` $\lang$ 过程体 $\rang$ `)` `)`。

变量定义除上述副作用外，使用其求值结果是未定义行为。实现可以将求值结果设置为指代该变量名的符号。

变量定义要么出现在过程体的开头，要么作为 *顶层表达式* 存在。其它位置出现的变量定义是未定义行为。

### 派生表达式

#### 多条件形式

<space-between>

`(` `cond` $\lang$ 子句<sub>1</sub> $\rang$ $\lang$ 子句<sub>2</sub> $\rang$ ... `)`

特殊形式

</space-between>
<space-between>

`else`

辅助语法

</space-between>

$\lang$ 子句 $\rang$ 具有形式 `(` $\lang$ 条件 $\rang$ $\lang$ 表达式<sub>1</sub> $\rang$ ... `)`。$\lang$ 条件 $\rang$ 可以为表达式或者 `else`。

求值多条件形式时，对每一个 $\lang$ 子句 $\rang$ 从前到后做如下操作：
- 若 $\lang$ 子句 $\rang$ 的 $\lang$ 条件 $\rang$ 是表达式，则求值该表达式。若求值结果为 *虚值*，则不做任何事，继续对下一个子句操作；
- 若 $\lang$ 条件 $\rang$ 是表达式，且求值结果不是 *虚值*，则对 $\lang$ 表达式 $\rang$ 从前至后依次求值。将最后一个表达式作为整个形式的求值结果，不再对剩余子句做任何操作。如果没有 $\lang$ 表达式 $\rang$，则将 $\lang$ 条件 $\rang$ 作为求值结果，不再对剩余子句做任何操作。
- 否则（$\lang$ 条件 $\rang$ 是 `else`），则对 $\lang$ 表达式 $\rang$ 从前至后依次求值。将最后一个表达式作为整个形式的求值结果。该子句不是最后一个子句时，发出错误信号。该子句不包含 $\lang$ 表达式 $\rang$ 时，引发未定义行为。
- 如果所有子句都被跳过，则引发未定义行为。

符号 `else` 其它场合被求值时，引发未定义行为。

#### 局部绑定形式

<space-between>

`(` `let` $\lang$ 绑定 $\rang$ $\lang$ 表达式<sub>1</sub> $\rang$ ... `)`

特殊形式

</space-between>

$\lang$ 绑定 $\rang$ 具有形式 `(` `(` $\lang$ 标识符<sub>1</sub> $\rang$ $\lang$ 初始值<sub>1</sub> $\rang$ `)` ... `)`。

对局部绑定形式求值，等价于求值 `(` `(` `lambda` `(` $\lang$ 标识符<sub>1</sub> $\rang$ ... `)` $\lang$ 表达式<sub>1</sub> $\rang$ ... `)` $\lang$ 初始值<sub>1</sub> $\rang$ ... `)`。

```scheme
(let ((x 2) (y 3))
     (* x y))       ⇒ 6
```

#### 顺序形式

<space-between>

`(` `begin` $\lang$ 表达式<sub>1</sub> $\rang$ $\lang$ 表达式<sub>2</sub> $\rang$ ... `)`

特殊形式

</space-between>

对顺序形式求值时，从前到后对 $\lang$ 表达式 $\rang$ 求值。将最后一个表达式作为整个形式的求值结果。

> 注：当表达式没有副作用时，只有最后一个表达式是有意义的；之前的所有表达式求值结果都将被抛弃。

#### 逻辑运算符


<space-between>

`(` `and` $\lang$ 表达式<sub>1</sub> $\rang$ ... `)`

特殊形式

</space-between>
<space-between>

`(` `or` $\lang$ 表达式<sub>1</sub> $\rang$ ... `)`

特殊形式

</space-between>

`and` 特殊形式被求值时，从前至后一次求值每一个 $\lang$ 表达式 $\rang$，直至该表达式求值结果为 *虚值*，并将该结果作为整个形式的求值结果。如果没有表达式求值得到 *虚值*，那么返回最后一个表达式的求值结果。如果特殊形式内不存在任何表达式，求值为 `#f`。

`or` 特殊形式被求值时，从前至后一次求值每一个 $\lang$ 表达式 $\rang$，直至该表达式求值结果不是 *虚值*，并将该结果作为整个形式的求值结果。如果所有表达式求值都得到 *虚值*，那么返回最后一个表达式的求值结果。如果特殊形式内不存在任何表达式，求值为 `#t`。

> 注：将逻辑运算实现为特殊形式，类似于其它编程语言中的短路求值特性。

#### 部分字面表达式

<space-between>

`(` `quasiquote` $\lang$ qqTemplate $\rang$ `)`

特殊形式

</space-between>
<space-between>

<code>&#96;</code> $\lang$ qqTemplate $\rang$

语法

</space-between>
<space-between>

`(` `unquote` $\lang$ 表达式 $\rang$ `)`

特殊形式

</space-between>
<space-between>

`,`

辅助语法

</space-between>

$\lang$ qqTemplate $\rang$ 是可以额外插入 `unquote` 特殊形式的表达式。

将 `quasiquote` 特殊形式求值为 $\lang$ qqTemplate $\rang$ 作为外部形式所指代的值。但是，对于 $\lang$ qqTemplate $\rang$ 中出现的 `unquote` 特殊形式或其简写语法，将其替换为 $\lang$ 表达式 $\rang$ 求值后的结果。

<code>&#96;</code> $\lang$ qqTemplate $\rang$ 是 `quasiquote` 特殊形式的简写。`,` $\lang$ 表达式 $\rang$ 是 `unquote` 特殊形式的简写。

在 `quasiquote` 特殊形式中再次使用 `quasiquote` 特殊形式或其简写语法，是未定义行为。

在 `quasiquote` 特殊形式外，使用 `unquote` 特殊形式或其简写语法，是未定义行为。

## 程序结构与解释流程

Mini-Lisp 程序由若干表达式组成，这些表达式不为任何其它表达式的子表达式，称之为 *顶层表达式*。不含任何表达式的 Mini-Lisp 程序引发未定义行为。

实现应当通过若干操作系统提供的 IO 接口，与操作系统交互并引发可观察副作用。操作系统应当提供输入接口 *标准输入*、输出接口 *标准输出* 和输出接口 *标准错误*。IO 接口传输的内容中，出现基本拉丁区（Unicode 码位 U+0000 至 U+007F）以外的 Unicode 字符时，行为是实现定义的。

实现解释 Mini-Lisp 程序时，应当提供两种解释模式：REPL 模式和文件模式。

在解释流程的最开始时刻，实现处于 *默认初始环境*。

### 默认初始环境

默认初始环境是指，包含本文档所述的库所定义的标识符的绑定的环境。实现可以定义其它绑定。

### REPL 模式

在 REPL 模式下，实现将从 *标准输入* 请求程序内容。实现可以输出 *提示符* 以提示用户向接口输入内容。提示符应当由 `> ` 结尾。

当 *标准输入* 收到数据后，实现应当持续解析输入数据，直到数据解析为某一数据的外部表示。如果部分数据已经可以判断为不符合任何类型数据的外部表示，则可以积极发出错误信号。

随后，实现应当对该数据作为表达式求值，并将求值结果的外部形式通过 *标准输出* 输出。如果该数据不是表达式，则必须发出错误信号。

```scheme
(define . 42) ⇒ 发出错误信号
(+ 1 42) ⇒ 输出 "43"
```

实现可以在外部形式的输出之前添加单引号 `'`。建议实现在外部形式的输出之后添加操作系统定义的换行符序列。

实现应当不断循环读取、解析、输出的过程，即使该过程中发出了错误信号。错误信号发出后，实现应当通过 *标准错误* 报告该错误。

当 *标准输入* 关闭（EOF）时，实现应当退出。

> 注：在 REPL 模式下，仅应在 *标准输入* 关闭时，以及 `exit` 内置过程调用时退出解释流程。

### 文件模式

在文件模式下，实现将向操作系统 IO 接口请求程序内容。通常情况下，该内容来自外存的文件，文件名以命令行参数的形式提供给实现。

实现应当试图将输入内容解析为若干表达式。如果不符合表达式文法，则应当发出错误信号，并以操作系统定义的失败退出码退出解释流程。

随后，实现应当对这些表达式从前至后依次求值。若某次求值发出错误信号，则以操作系统定义的失败退出码退出解释流程。

当所有表达式求值完毕后，应当以操作系统定义的成功退出码退出解释流程。

## 数据

### 数据相等性

任何两个数据之间存在相等性这一二元关系。相等性是等价关系，具有自反性、对称性、传递性。

不同类型的数据之间不具有相等性。

布尔类型的数据之间是否具有相等性，等价于它们具有相等的值。即，真值和真值之间具有相等性，假值和假值之间具有相等性。

数类型的数据之间是否具有相等性，等价于它们的内存表示是否相同。

> 注：如果实现采用 IEEE 754 双精度浮点类型存储数类型数据，那么 `+0` 和 `-0` 不具有相等性；`NaN` 和其它数的相等性是未定义的。

字符串类型的数据之间是否具有相等性，等价于：
- 字符串的长度相等，且
- 对应位置的字符都是同一 Unicode 码位的字符。

符号类型的数据之间的相等性等价于用于表示该符号的字符串的相等性。

对子类型的数据之间是否具有相等性，等价于两者的左半部分具有相等性，且右半部分也具有相等性。

过程类型的数据之间是否具有相等性是未定义的。

> 注：使用内置过程 `equal?` 测试两个数据的相等性。

### 数据恒等性

任何两个数据之间存在恒等性这一二元关系。

不同类型的数据之间不具有恒等性。

对于布尔类型、数类型、过程类型、符号类型和空表类型的数据，其恒等性等价于数据相等性。

对于字符串类型和对子类型的数据，其恒等性等价于存储该数据的存储空间是否位于同一地址。

> 注：使用内置过程 `eq?` 测试两个数据的恒等性。

### 空表类型

空表类型是 *空表* 的类型。*空表* 是一个特殊值。除空表外，没有数据是空表类型。

### 布尔类型

布尔类型是由 *真值* 和 *假值* 构成的集合。布尔类型没有其它的值。

*虚值* 是一类代表“假”的值，可以在条件形式中使用。在本文档规定的所有数据中，只有 *假值* 是虚值。


### 数类型

数类型是表示实数的类型。数类型的内存表示必须能精确存储介于 $-2^{31}$ 至 $2^{31}-1$ 之间（含）的所有整数，以及其中至少 5 位十进制有效数字的实数。

> 注：实现可以使用 IEEE 754 双精度浮点数类型存储数。实现也可以使用补码、有理数结构等其他形式存储特殊值。

### 字符串类型

字符串类型是表示若干 Unicode 字符的有限序列的类型。Unicode 字符的个数称为字符串的 *长度*。字符串的最大长度是实现定义的，不得小于 128。

字符串类型数据的存储形式（内存管理及编码方式）是实现定义的。

### 符号类型

符号类型是指代标识符的类型。当字面表达式（`quote` 形式）作用到标识符上时，得到指代该标识符的符号类型数据。

符号类型数据的存储形式（内存管理及编码方式）是实现定义的。

### 过程类型

过程类型是指代过程的类型。过程类型可以为本文档的库或实现扩展所定义的过程，称为 *内置过程*；亦或是 `lambda` 特殊形式所引入的过程类型数据。

### 对子类型

对子类型是由两个数据联合构成的类型。两个数据是有序的，分别称为该对子数据的 *左半部分* 和 *右半部分*。

### 列表与带点列表

对子类型和空表类型的组合可以构成 *列表*。*列表* 具有如下结构：

- 空表；或
- 对子，其中左半部分是任意数据，右半部分是 *列表*。

列表的 *元素* 是指该列表中涉及的所有对子的左半部分数据构成的有序序列。*元素* 中数据的先后顺序等价于其源自的对子的层级：先是最外层对子的左半部分，最后是最内层对子的左半部分。

若一个对子类型数据是列表，则其外部表示使用小括号 `(` `)` 括起，其中为空格分隔的，该列表的元素的外部表示。

```scheme
'(a . (b . (c . (d . ())))) ⇒ '(a b c d)
```

不是列表的对子也称作 *带点列表*。带点列表的 *元素* 是一系列有序数据，其定义为：
- 该对子的左半部分；
- 如果该对子的右半部分是对子，则后增此右半部分作为带点列表的 *元素*

> 例如：对子 `(a . (b . c))` 的元素为 `a` 和 `b`。

带点列表的 *点右数据* 定义为：
- 如果该对子的右半部分是对子，则此右半部分的 *点右数据*；
- 否则，就是此右半部分。

> 例如：对子 `(a . (b . c))` 的点右数据为 `c`。

带点列表的外部表示写作 `(` $\lang$ 空格分隔的元素的外部表示 $\rang$ `.` $\lang$ 点右数据的外部表示 $\rang$ `)`。

## 库

以下过程定义中，若实参不符合形参名于 [§1.3](#凡例) 中所规定的期望实参类型，实现应当发出错误信号。

### 核心库

<space-between>

`(` `apply` *proc* *list* `)`

过程

</space-between>

调用 *proc*，并将 *list* 的元素作为调用的实参。返回值：如是调用 *proc* 得到的返回值。

```scheme
(apply + '(1 2 3)) ⇒ 6
```

<space-between>

`(` `display` *val* `)`

过程

</space-between>

若 *val* 是字符串类型数据，则将字符串内容通过 *标准输出* 输出；否则输出 *val* 的外部表示，实现可以在外部表示前添加单引号 `'`。返回值：未定义；建议空表。

<space-between>

`(` `displayln` *val* `)`

过程

</space-between>

如同执行 `(` `begin` `(` `display` *val* `)` `(` `newline` `)` `)`。返回值：未定义；建议空表。

<space-between>

`(` `error` `)`

过程

</space-between>
<space-between>

`(` `error` *val* `)`

过程

</space-between>

以 *val* 为错误发送错误信号。返回值：绝不返回。

<space-between>

`(` `eval` *expr* `)`

过程

</space-between>

将 *expr* 作为 Mini-Lisp 程序表达式，对其进行求值。返回值：求值结果。

```scheme
(eval '(cons 1 (cons 2 nil))) ⇒ '(1 2)
```

<space-between>

`(` `exit` `)`

过程

</space-between>
<space-between>

`(` `exit` *n* `)`

过程

</space-between>

退出解释流程。返回值：绝不返回。

<space-between>

`(` `newline` `)`

过程

</space-between>

向 *标准输出* 输出操作系统定义的换行符序列。返回值：未定义；建议空表。

<space-between>

`(` `print` *val* `)`

过程

</space-between>

向 *标准输出* 输出 *val* 的外部表示，随后输出操作系统定义的换行符序列。实现可以在外部表示前添加单引号 `'`。返回值：未定义；建议空表。

### 类型检查库

<space-between>

`(` `atom?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为布尔类型、数类型、字符串类型、符号类型或空表类型的值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `boolean?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为布尔类型的值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `integer?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为数类型的值且 *arg* 是整数，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `list?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为列表，则返回 `#t`；否则返回 `#f`。

```scheme
(list? '())      ⇒ #t
(list? '(1 2 3)) ⇒ #t
(list? '(1 . 2)) ⇒ #f
```

<space-between>

`(` `number?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为数类型的值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `null?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为空表，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `pair?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为对子类型的值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `procedure?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为过程类型的值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `string?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为字符串类型的值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `symbol?` *arg* `)`

过程

</space-between>

返回值：若 *arg* 为符号类型的值，则返回 `#t`；否则返回 `#f`。

### 对子与列表操作库

<space-between>

`(` `append` *list*<sub>1</sub> ... `)`

过程

</space-between>

将 *list* 内的元素按顺序拼接为一个新的列表。返回值：拼接后的列表；实参个数为零时返回空表。

```scheme
(append '(1 2 3) '(a b c) '(foo bar baz)) ⇒ '(1 2 3 a b c foo bar baz)
```

<space-between>

`(` `car` *pair* `)`

过程

</space-between>

返回值： *pair* 的左半部分。

<space-between>

`(` `cdr` *pair* `)`

过程

</space-between>

返回值：*pair* 的右半部分。

<space-between>

`(` `cons` *first* *rest* `)`

过程

</space-between>

返回值：以 *first* 为左半部分，*rest* 为右半部分的对子类型数据。

<space-between>

`(` `length` *list* `)`

过程

</space-between>

返回值：非负整数，*list* 的元素个数。

<space-between>

`(` `list` *item*<sub>1</sub> ... `)`

过程

</space-between>

从 *item* 构建一个新的列表。返回值：新构建的列表。

<space-between>

`(` `map` *proc* *list* `)`

过程

</space-between>

*proc* 应能接受一个实参。返回值：一个新列表，其中的每个元素都是 *list* 中对应位置元素被 *proc* 作用后的结果。

```scheme
(map - '(1 2 3)) ⇒ '(-1 -2 -3)
```

实现可以扩展这一过程，如允许 *proc* 接受多个实参，作用在多个 *list* 的对应位置元素上。

<space-between>

`(` `filter` *proc* *list* `)`

过程

</space-between>

*proc* 应能接受一个实参。返回值：一个新列表，其中包含 *list* 中被 *proc* 作用后得到非虚值的元素，按原有顺序排列。

```scheme
(filter odd? '(1 2 3 4)) ⇒ '(1 3)
```

<space-between>

`(` `reduce` *proc* *list* `)`

过程

</space-between>

*proc* 应当接受两个实参。*list* 不能为空表。返回值：若 `(` `length` *list* `)` 求值为 1，则返回 `(` `car` *list* `)`；否则返回 `(` *proc* `(` `car` *list* `)` `(` `reduce` *proc* `(` `cdr` *list* `)` `)` `)`。

```scheme
(reduce * '(1 2 3 4)) ⇒ 24
```

### 算术运算库

<space-between>

`(` `+` *x*<sub>1</sub> ... `)`

过程

</space-between>

返回值：所有 *x* 的和。

<space-between>

`(` `-` *y* `)`

过程

</space-between>
<space-between>

`(` `-` *x* *y* `)`

过程

</space-between>

*x* 缺省为 0。返回值：$x - y$。

<space-between>

`(` `*` *x*<sub>1</sub> ... `)`

过程

</space-between>

返回值：所有 *x* 的积。

<space-between>

`(` `/` *y* `)`

过程

</space-between>
<space-between>

`(` `/` *x* *y* `)`

过程

</space-between>

*x* 缺省为 1。返回值：$\dfrac x y$。若 $y = 0$ 时，行为未定义。建议发出错误信号。

```scheme
(/ 4)    ⇒ 0.25
(/ 7 2)  ⇒ 3.5
```

<space-between>

`(` `abs` *x* `)`

过程

</space-between>

返回值：$|x|$。

<space-between>

`(` `expt` *x* *y* `)`

过程

</space-between>

返回值：$x^y$。若 $x = 0 \wedge y = 0$，行为未定义。

<space-between>

`(` `quotient` *x* *y* `)`

过程

</space-between>

返回值：$\left[\dfrac xy\right]$；向零取整函数 $[x]$ 定义为 $\begin{cases}\lfloor x\rfloor,&x\geqslant0\\\lceil x\rceil,&x<0\end{cases}$。

<space-between>

`(` `modulo` *x* *y* `)`

过程

</space-between>

返回值：与 *y* 具有相同正负性的值 $q$，满足 $0\leqslant|q|<|y|$ 且 $y$ 整除 $|q-x|$。

```scheme
(modulo  10  3)  ⇒  1
(modulo -10  3)  ⇒  2
(modulo  10 -3)  ⇒ -2
(modulo -10 -3)  ⇒ -1
```

<space-between>

`(` `remainder` *x* *y* `)`

过程

</space-between>

返回值：与 *x* 具有相同正负性的值 $q$，满足 $0\leqslant|q|<|y|$ 且 $q + y\cdot\left[\dfrac xy\right] = x$。

```scheme
(remainder  10  3)  ⇒  1
(remainder -10  3)  ⇒ -1
(remainder  10 -3)  ⇒  1
(remainder -10 -3)  ⇒ -1
```

### 比较库

<space-between>

`(` `eq?` *a* *b* `)`

过程

</space-between>

返回值：若 *a* 和 *b* 具有数据恒等性，则返回 `#t`；否则返回 `#f`。

```scheme
(eq? '(1 2 3) '(1 2 3)) ⇒ #f
(define x '(1 2 3))
(eq? x x)               ⇒ #t
```

<space-between>

`(` `equal?` *a* *b* `)`

过程

</space-between>

返回值：若 *a* 和 *b* 具有数据相等性，则返回 `#t`；否则返回 `#f`。

```scheme
(eq? '(1 2 3) '(1 2 3)) ⇒ #t
```

<space-between>

`(` `not` *val* `)`

过程

</space-between>

返回值：若 *val* 为虚值，则返回 `#t`；否则返回 `#f`。

<space-between>

`(` `=` *x* *y* `)`

过程

</space-between>

返回值：若 $x = y$，返回 `#t`；否则返回 `#f`。

<space-between>

`(` `<` *x* *y* `)`

过程

</space-between>

返回值：若 $x < y$，返回 `#t`；否则返回 `#f`。

<space-between>

`(` `>` *x* *y* `)`

过程

</space-between>

返回值：若 $x > y$，返回 `#t`；否则返回 `#f`。


<space-between>

`(` `<=` *x* *y* `)`

过程

</space-between>

返回值：若 $x \leqslant y$，返回 `#t`；否则返回 `#f`。

<space-between>

`(` `>=` *x* *y* `)`

过程

</space-between>

返回值：若 $x \geqslant y$，返回 `#t`；否则返回 `#f`。

<space-between>

`(` `even?` *n* `)`

过程

</space-between>

返回值：若 $2 \mid n$，返回 `#t`；否则返回 `#f`。

<space-between>

`(` `odd?` *n* `)`

过程

</space-between>

返回值：若 $2 \nmid n$，返回 `#t`；否则返回 `#f`。

<space-between>

`(` `zero?` *x* `)`

过程

</space-between>

返回值：若 $x = 0$，返回 `#t`；否则返回 `#f`。

> 注：若实现采用 IEEE 754 内存表示存储数类型数据，则 IEEE 754 `+0` 与 IEEE 754 `-0` 被 `zero?` 作用都应得到 `#t`。
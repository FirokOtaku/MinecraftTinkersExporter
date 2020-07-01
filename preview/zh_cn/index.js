
class AttrType
{
    static listTypes=[];
    static mapTypes={};
    static getType(type='')
    {
        return AttrType.mapTypes[type];
    }
    constructor(id='',name='',type='number',getter=()=>0) {
        this.id=id;
        this.name=name;
        this.type=type;
        this.getter=getter;
        AttrType.listTypes.push(this);
        AttrType.mapTypes[id]=this;
    }
}
const TypeName=new AttrType('name',lang.Name,'string',(mat)=>mat.name);

const TypeHeadDurability=new AttrType('head.durability',lang.HeadDurability,'number',mat=>mat.head?mat.head.durability:NaN);
const TypeHeadAttack=new AttrType('head.attack',lang.HeadAttack,'number',mat=>mat.head?mat.head.attack:NaN);
const TypeHeadLevel=new AttrType('head.level',lang.HeadLevel,'number',mat=>mat.head?mat.head.level:NaN);
const TypeHeadSpeed=new AttrType('head.speed',lang.HeadSpeed,'number',mat=>mat.head?mat.head.speed:NaN);
const TypeHeadTraits=new AttrType('head.traits',lang.HeadTraits,'trait',mat=>mat.head?mat.head.traits:null);

const TypeHandleDurability=new AttrType('handle.durability',lang.HandleDurability,'number',mat=>mat.handle?mat.handle.durability:NaN);
const TypeHandleModifier=new AttrType('handle.modifier',lang.HandleModifier,'number',mat=>mat.handle?mat.handle.modifier:NaN);
const TypeHandleTraits=new AttrType('handle.traits',lang.HandleTraits,'trait',mat=>mat.handle?mat.handle.traits:null);

const TypeExtraDurability=new AttrType('extra.durability',lang.ExtraDurability,'number',mat=>mat.extra?mat.extra.durability:NaN);
const TypeExtraTraits=new AttrType('extra.traits',lang.ExtraTraits,'trait',mat=>mat.extra?mat.extra.traits:null);

const TypeBowAttack=new AttrType('bow.attack',lang.BowAttack,'number',mat=>mat.bow?mat.bow.damage:NaN);
const TypeBowRange=new AttrType('bow.range',lang.BowRange,'number',mat=>mat.bow?mat.bow.range:NaN);
const TypeBowSpeed=new AttrType('bow.speed',lang.BowSpeed,'number',mat=>mat.bow?mat.bow.speed:NaN);
const TypeBowTraits=new AttrType('bow.traits',lang.BowTraits,'trait',mat=>mat.bow?mat.bow.traits:null);

const TypeStringModifier=new AttrType('string.modifier',lang.StringModifier,'number',mat=>mat.string?mat.string.modifier:NaN);
const TypeStringTraits=new AttrType('string.traits',lang.StringTraits,'trait',mat=>mat.string?mat.string.traits:null);

const TypeFletchingAccuracy=new AttrType('fletching.accuracy',lang.FletchingAccuracy,'number',mat=>mat.fletching?mat.fletching.accuracy:NaN);
const TypeFletchingModifier=new AttrType('fletching.modifier',lang.FletchingModifier,'number',mat=>mat.fletching?mat.fletching.modifier:NaN);
const TypeFletchingTraits=new AttrType('fletching.traits',lang.FletchingTraits,'trait',mat=>mat.fletching?mat.fletching.traits:null);

const TypeShaftModifier=new AttrType('shaft.modifier',lang.ShaftModifier,'number',mat=>mat.shaft?mat.shaft.modifier:NaN);
const TypeShaftAmmo=new AttrType('shaft.ammo',lang.ShaftAmmo,'number',mat=>mat.shaft?mat.shaft.ammo:NaN);
const TypeShaftTraits=new AttrType('shaft.traits',lang.ShaftTraits,'trait',mat=>mat.shaft?mat.shaft.traits:null);

const TypeCoreDefense=new AttrType('core.defense',lang.CoreDefense,'number',mat=>mat.core?mat.core.defense:NaN);
const TypeCoreDurability=new AttrType('core.durability',lang.CoreDurability,'number',mat=>mat.core?mat.core.durability:NaN);
const TypeCoreTraits=new AttrType('core.traits',lang.CoreTraits,'trait',mat=>mat.core?mat.core.traits:null);

const TypePlateDurability=new AttrType('plate.durability',lang.PlateDurability,'number',mat=>mat.plate?mat.plate.durability:NaN);
const TypePlateToughness=new AttrType('plate.toughness',lang.PlateToughness,'number',mat=>mat.plate?mat.plate.toughness:NaN);
const TypePlateModifier=new AttrType('plate.modifier',lang.PlateModifier,'number',mat=>mat.plate?mat.plate.modifier:NaN);
const TypePlateTraits=new AttrType('plate.traits',lang.PlateTraits,'trait',mat=>mat.plate?mat.plate.traits:null);

const TypeTrimDurability=new AttrType('trim.durability',lang.TrimDurability,'number',mat=>mat.trim?mat.trim.durability:NaN);
const TypeTrimTraits=new AttrType('trim.traits',lang.TrimTraits,'trait',mat=>mat.trim?mat.trim.traits:null);

const TypesTool=[TypeName,TypeHeadAttack,TypeHeadDurability,TypeHeadSpeed,TypeHeadLevel,TypeHeadTraits,
TypeHandleDurability,TypeHandleModifier,TypeHandleTraits,
TypeExtraDurability,TypeExtraTraits];
const TypesBow=[TypeName,TypeBowAttack,TypeBowRange,TypeBowSpeed,TypeBowTraits,
TypeFletchingAccuracy,TypeFletchingModifier,TypeFletchingTraits,
TypeShaftAmmo,TypeShaftModifier,TypeShaftTraits,
TypeStringModifier,TypeStringTraits,];
const TypesArmor=[TypeName,TypeCoreDefense,TypeCoreDurability,TypeCoreTraits,
TypePlateDurability,TypePlateToughness,TypePlateModifier,TypePlateTraits,
TypeTrimDurability,TypeTrimTraits,];

class Filter
{
    test(material){
        return false;
    }
}
class MaterialFilter extends Filter
{
    constructor(source=null,oper=null,value=null,value2=null) {
        super();
        this.source=source;
        this.oper=oper;
        this.value=value;
        this.value2=value2;
    }
    test(material) {
        let source=this.source;
        let oper=this.oper;
        let value=this.value;
        let value2=this.value2;
        if(source==null || oper==null || value==null) return false;

        let data=undefined;
        try
        {
            switch(source)
            {
                case 'name': data=material.name; break;
                case 'head.durability': data=material.head.durability; break;
                case 'head.attack': data=material.head.attack; break;
                case 'head.level': data=material.head.level; break;
                case 'head.speed': data=material.head.speed; break;
                case 'head.traits': data=material.head.traits; break;
                case 'handle.durability': data=material.handle.durability; break;
                case 'handle.modifier': data=material.handle.modifier; break;
                case 'handle.traits': data=material.handle.traits; break;
                case 'extra.durability': data=material.extra.durability; break;
                case 'extra.traits': data=material.extra.traits; break;
                case 'bow.attack': data=material.bow.damage; break;
                case 'bow.range': data=material.bow.range; break;
                case 'bow.speed': data=material.bow.speed; break;
                case 'bow.traits': data=material.bow.traits; break;
                case 'string.modifier': data=material.string.modifier; break;
                case 'string.traits': data=material.string.traits; break;
                case 'fletching.accuracy': data=material.fletching.accuracy; break;
                case 'fletching.modifier': data=material.fletching.modifier; break;
                case 'fletching.traits': data=material.fletching.traits; break;
                case 'shaft.modifier': data=material.shaft.modifier; break;
                case 'shaft.ammo': data=material.shaft.ammo; break;
                case 'shaft.traits': data=material.shaft.traits; break;
                case 'core.defense': data=material.core.defense; break;
                case 'core.durability': data=material.core.durability; break;
                case 'core.traits': data=material.core.traits; break;
                case 'plate.defense': data=material.plate.defense; break;
                case 'plate.toughness': data=material.plate.toughness; break;
                case 'plate.modifier': data=material.plate.modifier; break;
                case 'plate.traits': data=material.plate.traits; break;
                case 'trim.durability': data=material.trim.durability; break;
                case 'trim.traits': data=material.trim.traits; break;
                default: return false;
            }
        }
        catch (e) { }

        switch(AttrType.getType(source).type)
        {
            case 'number':{
                switch(oper){
                    case 'greater': return data > value;
                    case 'greater_equal': return data >= value;
                    case 'equal': return data == value;
                    case 'lesser': return data < value;
                    case 'lesser_equal': return data <= value;
                    case 'approach': return Math.abs(data-value) < value2;
                }
                break;
            }
            case 'string':{
                if(data==undefined) data='';
                switch(oper){
                    case 'include': return data.indexOf(value)>=0;
                    case 'exclude': return data.indexOf(value)<0;
                    case 'full_equal': return data===value;
                    case 'non_equal': return data!==value;
                }
                break;
            }
            case 'trait':{
                if(data==undefined) data=[];
                console.log(`data ${data} value ${value} oper ${oper}`);
                let ret=undefined;
                switch(oper){
                    case 'include': ret= MaterialFilter.traitsContains(data,value)>=0; break;
                    case 'exclude': ret= MaterialFilter.traitsContains(data,value)<0; break;
                }
                console.log(ret);
                return ret;
                break;
            }
            default: return false;
        }

        return false;
    }

    static operName(oper) {
        switch (oper) {
            case 'greater': return '＞';
            case 'greater_equal': return  '≥';
            case 'equal': return '=';
            case 'lesser': return '<';
            case 'lesser_equal': return '≤';
            case 'approach': return '≈';

            case 'include': return lang.Include;
            case 'exclude': return lang.Exclude;
            case 'full_equal': return lang.FullEqual;
            case 'non_equal': return lang.NonEqual;

            default: return '(错误-error)';
        }
    }
    static traitsContains(arrTraits=[],idTrait='')
    {
        for(let i=0;i<arrTraits.length;i++)
        {
            let tid=arrTraits[i];
            let trait=dataTic.traits[tid];
            if(trait==null) continue;

            if(tid.indexOf(idTrait)>=0 || trait.name.indexOf(idTrait)>=0) return i;
        }
        return -1;
    }

    info(){
        let source=this.source;
        let type=this.oper;
        let value=this.value;
        return `${AttrType.getType(source).name} - ${MaterialFilter.operName(type)} ${value}`;
    }
}
Vue.prototype.dataTic=dataTic;
Vue.prototype.renderText=function(raw='') {
    raw=''+raw;
    if(raw.length<=1) return raw;

    let currentColor='0';
    let currentL=false; // 粗体
    let currentM=false; // 删除线
    let currentN=false; // 下划线
    let currentO=false; // 斜体

    let arr=[];

    for(let step=0;step<raw.length;step++)
    {
        let char=raw.charAt(step);
        if(char==='§')
        {
            if(step===raw.length-1) break;

            let code=raw.charAt(step+1);
            switch(code)
            {
                case '0': case '1': case '2': case '3':
                case '4': case '5': case '6': case '7':
                case '8': case '9': case 'a': case 'b':
                case 'c': case 'd': case 'e': case 'f':
                currentColor=code; break;

                case 'l': currentL=true; break;
                case 'm': currentM=true; break;
                case 'n': currentN=true; break;
                case 'o': currentO=true; break;
                case 'r':
                {
                    currentColor='0';
                    currentL=false;
                    currentM=false;
                    currentN=false;
                    currentO=false;
                    break;
                }
                default:
                {
                    break;
                }
            }

            step++;
        }
        else
        {
            arr.push({
                C: currentColor,
                L: currentL,
                M: currentM,
                N: currentN,
                O: currentO,
                c: char,
            })
        }
    }

    function getColor(code='0') {
        switch(code){
            case '0': return 'black';
            case '1': return 'darkblue';
            case '2': return 'darkgreen';
            case '3': return 'mediumturquoise';
            case '4': return 'darkred';
            case '5': return '#A0A';
            case '6': return 'gold';
            case '7': return 'gray';
            case '8': return 'darkgray';
            case '9': return 'blue';
            case 'a': return 'green';
            case 'b': return 'aqua';
            case 'c': return 'red';
            case 'd': return '#F5F';
            case 'e': return 'yellow';
            case 'f': return 'white';
            default: return '#000';
        }
    }
    function createTag(node) {
        let tag=`<span style='color:${getColor(node.C)}`;
        if(node.M||node.N){
            tag+=';text-decoration:';
            if(node.M) tag+=' line-through';
            if(node.N) tag+=' underline';
        }
        if(node.L) tag+=';font-weight:bold';
        if(node.O) tag+=';font-style:italic';
        tag+=`'>`;
        return tag;
    }
    let out='';
    for(let step=0;step<arr.length;step++){
        let nodeNow=arr[step];
        if(step>0){
            let nodePre=arr[step-1];
            // C: currentColor,
            // L: currentL,
            // M: currentM,
            // N: currentN,
            // O: currentO,
            // c: char,
            let non_equal=nodePre.C!=nodeNow.C || nodePre.L!=nodeNow.L || nodePre.M!=nodeNow.M || nodePre.N!=nodeNow.N || nodePre.O!=nodeNow.O;
            if(non_equal)
            {
                out+='</span>'+createTag(nodeNow);
            }
        }
        else { // step==0
            out+=createTag(nodeNow);
        }
        switch(nodeNow.c){
            case '\n':case '\r': out+='<br>'; break;
            default: out+=nodeNow.c; break;
        }

        if(step==arr.length-1) out+='</span>';
    }
    out=out.replace(/\n|\\n/g,'<br>'); // 替换所有换行符
    return out;
};
Vue.prototype.toArr=function( objs=[], fun=()=>0 )
{
    let ret=[];
    for(let i=0;i<objs.length;i++)
    {
        let obj=objs[i];
        let data=fun(obj);
        if(!data) data=0;
        ret.push(data);
    }
    return ret;
};

Vue.component('traits',{
    props: ['traits'],
    template:
`<div>
<div v-if="traits && traits.length">
    <div v-for="trait in traits" v-on:click="$emit('trait-click',trait)">
        {{ dataTic.traits[trait].name }}
    </div>
</div>
<div v-else> - </div>

</div>`,
})
// <div v-bind:style="{color:'#'+trait.color}">{{trait.name}}</div>
Vue.component('trait',{
    props: ['trait'],
    template:
`<div v-if="trait" style="border:1px solid dimgray">

    <div style="background-color:silver"><span style="font-weight: 800;display: inline">{{trait.name}}</span> <span>{{trait.id}}</span> </div>
    <div v-html="renderText(trait.desc)"></div>
    
</div>`,
});

// register component to use
Vue.component('v-chart', window.VueECharts);

const app=new Vue({
    el: '#app',
    data:{
        AttrType:AttrType,
        lang: lang,
        TypesTool:TypesTool,
        TypesBow:TypesBow,
        TypesArmor:TypesArmor,

        inFilterType:'head.durability',

        inFilterTypeNumber: 'greater_equal',
        inFilterIntervalNumber: 10,
        inFilterValueNumber: 0,

        inFilterTypeString: 'include',
        inFilterValueString: '',

        inFilterTypeTrait: 'include',
        inFilterValueTrait: '',

        quickSwitchPage: true,
        duplicatedMaterial: false,


        dataTic: dataTic,

        outText: '',

        filters:[],
        results:[],

        currentMaterials: [],
        currentPage: 'search',

        currentType: 'tool',
        currentChartType: null,

        enablePageAllMaterials: false,
        enablePageAllTraits: false,

    },
    methods:{
        computeMaterialChartOptions: function(type) {
            let arrNames=this.toArr(this.currentMaterials,mat=>mat.name);
            let arrDatas=this.toArr(this.currentMaterials,mat=>type.getter(mat));
            let options={
                xAxis: {
                    type: 'category',
                    data: arrNames,
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: arrDatas,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)'
                    }
                }],
            };

            return options;
        },

        traitClick: function(e){
            console.log(e);
        },
        addFilter: function(){
            let filter=null;
            if(this.inFilterIsNumber)
            {
                filter=new MaterialFilter(this.inFilterType,this.inFilterTypeNumber,this.inFilterValueNumber,this.inFilterIntervalNumber);
            }
            else if(this.inFilterIsString)
            {
                filter=new MaterialFilter(this.inFilterType,this.inFilterTypeString,this.inFilterValueString);
            }
            else if(this.inFilterIsTrait)
            {
                filter=new MaterialFilter(this.inFilterType,this.inFilterTypeTrait,this.inFilterValueTrait);
            }

            this.filters.push(filter);
        },
        removeFilter: function(index){
            this.filters.splice(index,1);
        },
        removeFilters: function(){
            this.filters.splice(0,this.filters.length);
        },

        openMaterial: function(material){
            if(!material || !material.id || !material.name) return;

            let shouldPush=false;
            if(this.duplicatedMaterial)
            {
                shouldPush=true;
            }
            else
            {
                shouldPush = !this.computeMaterialButtonCount(material);
            }
            if(shouldPush) this.currentMaterials.push(material);

            if(this.quickSwitchPage) this.currentPage='material';
        },
        openAllResultMaterials: function(){
            if(!this.results.length) return;

            for(let i=0;i<this.results.length;i++)
            {
                this.openMaterial(this.results[i]);
            }
        },
        closeMaterial: function(index){
            if(index<0 || index>=this.currentMaterials.length) return;
            this.currentMaterials.splice(index,1);
        },
        closeAllMaterials: function(){
            this.currentMaterials.splice(0,this.currentMaterials.length);
        },

        filt: function(){
            this.results.splice(0,this.results.length);
            let keys=Object.keys(this.dataTic.materials);
            for(let i=0;i<keys.length;i++)
            {
                let material=this.dataTic.materials[keys[i]];
                let ok=true;

                for(let j=0;j<this.filters.length && ok;j++)
                {
                    let filter=this.filters[j];
                    let continueFilter=true;
                    if(!filter.test(material))
                    {
                        ok=false;
                    }
                }
                if(ok) this.results.push(material);

            }
        },

        computeTraits: function(material) {
            if(!material) return [];
            let set=new Set();
            function addTrait(component){
                if(!component) return;
                let ids=component.traits;
                for(let i=0;i<ids.length;i++){
                    let id=ids[i];
                    set.add(dataTic.traits[id]);
                }
            }
            let m=material;
            addTrait(m.head);
            addTrait(m.handle);
            addTrait(m.extra);
            addTrait(m.bow);
            addTrait(m.string);
            addTrait(m.fletching);
            addTrait(m.shaft);
            addTrait(m.core);
            addTrait(m.plate);
            addTrait(m.trim);
            let ret=[];
            for(let t of set) ret.push(t);
            return ret;
        },
        computePageButtonClass: function(button)
        {
            return button==this.currentPage? 'btn btn-success col-xs-3': 'btn btn-default col-xs-3';
        },
        computeMaterialButtonCount: function(material)
        {
            for(let materialOpened of this.currentMaterials)
            {
                if(materialOpened === material) return true;
            }
            return false;
        },
        computeTypeButtonClass: function(button){
            const selected='btn btn-success col-xs-4 col-sm-4 col-md-4 col-lg-3';
            const normal='btn btn-default col-xs-4 col-sm-4 col-md-4 col-lg-3';
            return this.currentType===button?selected:normal;
        },
    },
    computed:{
        inFilterIsNumber: function(){
            return this.AttrType.getType(this.inFilterType).type=='number';
        },
        inFilterIsString: function (){
            return this.AttrType.getType(this.inFilterType).type=='string';
        },
        inFilterIsTrait: function (){
            return this.AttrType.getType(this.inFilterType).type=='trait';
        },

        currentMaterialsName: function(){
            return this.toArr(this.currentMaterials,mat=>mat.name);
        },
        currentTypes: function(){
            switch(this.currentType){
                case 'tool': return this.TypesTool;
                case 'bow': return this.TypesBow;
                case 'armor': return this.TypesArmor;
                default: return this.TypesTool;
            }
        },

        // radarDatas: function(){
        //     let materials=this.currentMaterials;
        //
        //     let seriesData=[];
        //     for(let mat of materials)
        //     {
        //         seriesData.push({
        //             name: mat.name,
        //             value: [
        //                 mat.head? mat.head.durability : NaN,
        //                 mat.head? mat.head.attack : NaN,
        //                 mat.head? mat.head.level : NaN,
        //                 mat.head? mat.head.speed : NaN,
        //
        //                 mat.handle? mat.handle.durability : NaN,
        //                 mat.handle? mat.handle.modifier : NaN,
        //
        //                 mat.extra? mat.extra.durability : NaN,
        //
        //                 mat.bow? mat.bow.attack : NaN,
        //                 mat.bow? mat.bow.range : NaN,
        //                 mat.bow? mat.bow.speed : NaN,
        //
        //                 mat.string? mat.string.modifier : NaN,
        //
        //                 mat.fletching? mat.fletching.accuracy : NaN,
        //                 mat.fletching? mat.fletching.modifier : NaN,
        //
        //                 mat.shaft? mat.shaft.modifier : NaN,
        //                 mat.shaft? mat.shaft.ammo : NaN,
        //
        //                 mat.core? mat.core.defense : NaN,
        //                 mat.core? mat.core.durability : NaN,
        //
        //                 mat.plate? mat.plate.durability : NaN,
        //                 mat.plate? mat.plate.toughness : NaN,
        //                 mat.plate? mat.plate.modifier : NaN,
        //
        //                 mat.trim? mat.trim.durability : NaN,
        //             ]
        //         });
        //     }
        //     let options={
        //         title: {
        //             text: ''
        //         },
        //         tooltip: {},
        //         legend: {
        //             data: this.toArr(materials,(material)=>material.name),
        //         },
        //         radar: {
        //             // shape: 'circle',
        //             name: {
        //                 textStyle: {
        //                     color: '#fff',
        //                     backgroundColor: '#999',
        //                     borderRadius: 3,
        //                     padding: [3, 5]
        //                 }
        //             },
        //             indicator: [
        //                 { name: '头部-耐久度', max: 1200, min: 100 },
        //                 { name: '头部-攻击力', max: 9, min: 0 },
        //                 { name: '头部-挖掘等级', max: 4, min: 0 },
        //                 { name: '头部-挖掘速度', max: 12, min: 0 },
        //                 { name: '手柄-耐久度', max: 250, min: -200 },
        //                 { name: '手柄-系数', max: 1.5, min: 0 },
        //                 { name: '额外-耐久度', max: 450, min:-100 },
        //                 { name: '弓臂-攻击力', max: 8, min: -3 },
        //                 { name: '弓臂-射程', max: 2, min: 0 },
        //                 { name: '弓臂-速度', max: 1.5, min: 0 },
        //                 { name: '弓弦-系数', max: 1.5, min: 0 },
        //                 { name: '箭羽-准度', max: 1.5, min: 0 },
        //                 { name: '箭羽-系数', max: 1.5, min: 0 },
        //                 { name: '箭杆-系数', max: 1.5, min: 0 },
        //                 { name: '箭杆-额外弹药', max: 20, min: 0 },
        //                 { name: '基底-护甲', max: 20, min: 0 },
        //                 { name: '基底-耐久', max: 20, min: 0 },
        //                 { name: '护甲板-耐久', max: 8, min: -15 },
        //                 { name: '护甲板-韧性', max: 5, min: 0 },
        //                 { name: '护甲板-系数', max: 1.5, min: 0 },
        //             ]
        //         },
        //         series: [{
        //             name: '材料对比',
        //             type: 'radar',
        //             // areaStyle: {normal: {}},
        //             data: seriesData,
        //         }],
        //
        //         width: '800px',
        //         height: '600px',
        //     };
        //
        //
        //     return options;
        // },
    }
});

app.filt();

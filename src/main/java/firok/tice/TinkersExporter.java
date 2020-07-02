package firok.tice;

import c4.conarm.lib.materials.CoreMaterialStats;
import c4.conarm.lib.materials.PlatesMaterialStats;
import c4.conarm.lib.materials.TrimMaterialStats;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import net.minecraft.client.Minecraft;
import net.minecraft.client.resources.IResource;
import net.minecraft.client.resources.IResourceManager;
import net.minecraft.util.ResourceLocation;
import net.minecraft.util.text.translation.I18n;
import net.minecraftforge.fml.common.Loader;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.ModContainer;
import net.minecraftforge.fml.common.event.*;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.Logger;
import slimeknights.tconstruct.TConstruct;
import slimeknights.tconstruct.library.TinkerRegistry;
import slimeknights.tconstruct.library.materials.*;
import slimeknights.tconstruct.library.traits.AbstractTrait;
import slimeknights.tconstruct.library.traits.ITrait;

import java.io.File;
import java.io.PrintStream;
import java.lang.reflect.Field;
import java.util.*;

import static net.minecraftforge.fml.common.Loader.isModLoaded;

@Mod(
		modid = TinkersExporter.MOD_ID,
		name = TinkersExporter.MOD_NAME,
		version = TinkersExporter.VERSION,
		clientSideOnly = true,
		dependencies = "required-after:tconstruct@[1.12.2-2.13.0.171,)"
)
public class TinkersExporter
{
	public static final String MOD_ID = "tic_exporter";
	public static final String MOD_NAME = "Tinkers' Exporter";
	public static final String VERSION = "1.12.2-0.1.0";

	private static boolean enableConarm = false;
	public static final String CONARM_ID = "conarm";

	@Mod.Instance(MOD_ID)
	public static TinkersExporter INSTANCE;


	private static Logger logger;
	public static void log(Object content)
	{
		log(content,Level.INFO);
	}
	public static void log(Object content,Level level)
	{
		logger.log(level,content);
	}


	public static boolean enableConarm()
	{
		return enableConarm;
	}

	@Mod.EventHandler
	public void preinit(FMLPreInitializationEvent event)
	{
		logger=event.getModLog();
	}
	@Mod.EventHandler
	public void postinit(FMLPostInitializationEvent event)
	{
		log("Hi there. We are now exporting.");
		enableConarm= isModLoaded(CONARM_ID);

		String parent="./"+MOD_ID;
		File dir=new File("./",MOD_ID);
		if(!dir.exists()) dir.mkdirs();

		try
		{
			exportWebResources(parent);
			exportDataJs(parent,"data.js");
			exportLangJs(parent,"lang.js");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	private static void exportWebResources(String parent)
	{
		try
		{
			IResourceManager manager=Minecraft.getMinecraft().getResourceManager();

			IResource resIndex=manager.getResource(new ResourceLocation(MOD_ID,"web/index.html"));
			IResource resJs=manager.getResource(new ResourceLocation(MOD_ID,"web/index.js"));

			IResource resCssBootstrap = manager.getResource(new ResourceLocation(MOD_ID,"web/bootstrap.min.css"));
			IResource resJsBootstrap = manager.getResource(new ResourceLocation(MOD_ID,"web/bootstrap3_3_7.min.js"));

			IResource resJsECharts = manager.getResource(new ResourceLocation(MOD_ID,"web/echarts4_1_0.min.js"));

			IResource resJsJquery = manager.getResource(new ResourceLocation(MOD_ID,"web/jquery2_1_1.min.js"));

			IResource resJsVue = manager.getResource(new ResourceLocation(MOD_ID,"web/vue2_6_11.min.js"));
			IResource resJsVueEcharts = manager.getResource(new ResourceLocation(MOD_ID,"web/vue-echarts4_0_2.min.js"));

			File outIndex=new File(parent,"index.html");
			File outJs=new File(parent,"index.js");

			File outCssBootstrap = new File(parent,"bootstrap.min.css");
			File outJsBootstrap = new File(parent,"bootstrap3_3_7.min.js");

			File outJsEcharts = new File(parent,"echarts4_1_0.min.js");
			File outJsJquery = new File(parent,"jquery2_1_1.min.js");

			File outJsVue = new File(parent,"vue2_6_11.min.js");
			File outJsVueEcharts = new File(parent,"vue-echarts4_0_2.min.js");

			copy(resIndex,outIndex);
			copy(resJs,outJs);
			copy(resCssBootstrap,outCssBootstrap);
			copy(resJsBootstrap,outJsBootstrap);
			copy(resJsECharts,outJsEcharts);
			copy(resJsJquery,outJsJquery);
			copy(resJsVue,outJsVue);
			copy(resJsVueEcharts,outJsVueEcharts);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	private static void copy(IResource resource,File outFile) throws Exception
	{
		FileUtils.copyInputStreamToFile(resource.getInputStream(),outFile);
//		try(Scanner in=new Scanner(resource.getInputStream(),"utf-8");PrintStream out=new PrintStream(outFile,"utf-8"))
//		{
//			while(in.hasNextLine())
//			{
//				String line=in.nextLine();
//
//				out.println(line);
//			}
//			out.flush();
//		}
	}

	private static void exportDataJs(String parent,String filename) throws Exception
	{
		File file=new File(parent,filename);
		try(PrintStream ofs=new PrintStream(file,"utf-8"))
		{
			ofs.println("const dataTic=");

			JsonObject base=new JsonObject();
			JsonObject jsonMaterials=new JsonObject();
			JsonObject jsonTraits=new JsonObject();
			JsonObject jsonInfo=new JsonObject();
			jsonInfo.addProperty("source",TinkersExporter.MOD_NAME);
			jsonInfo.addProperty("version_tic_exporter",TinkersExporter.VERSION);
			jsonInfo.addProperty("version_tic", TConstruct.modVersion);

			JsonArray arrModList=new JsonArray();
			List<ModContainer> modList=Loader.instance().getModList();
			for(ModContainer mod:modList)
			{
				JsonObject jsonModInfo=new JsonObject();

				jsonModInfo.addProperty("name",mod.getName());
				jsonModInfo.addProperty("id",mod.getModId());
				jsonModInfo.addProperty("version",mod.getDisplayVersion());

				arrModList.add(jsonModInfo);
			}
			jsonInfo.add("mod_list",arrModList);
			jsonInfo.addProperty("create_time",System.currentTimeMillis());


			TinkerRegistry.getAllMaterials().forEach(material->{
				if(material==null) return;

				JsonObject jsonMaterial=new JsonObject();

				String idMaterial=material.identifier;
				int color=material.materialTextColor;

				if(idMaterial.contains("_internal_")) return;

				jsonMaterial.addProperty("id",idMaterial);
				jsonMaterial.addProperty("color",Integer.toHexString(color));
				jsonMaterial.addProperty("name",material.getLocalizedName());

				Collection<IMaterialStats> stats=material.getAllStats();
				stats.forEach(istat->{

					JsonObject jsonStat=new JsonObject();

					String type=jsonTic(jsonStat,istat);

					if(type==null && TinkersExporter.enableConarm()) type=jsonConarm(jsonStat,istat);

					if(type!=null)
					{
						JsonArray arrStatTraits=new JsonArray();

						String idStat=istat.getIdentifier();

						List<ITrait> statTraits=material.getAllTraitsForStats(idStat);
						statTraits.forEach(statTrait->arrStatTraits.add(statTrait.getIdentifier()));
						jsonStat.add("traits",arrStatTraits);

						jsonMaterial.add(type,jsonStat);
					}
				});

				jsonMaterials.add(idMaterial,jsonMaterial);
			});
			Field fieldTraits=TinkerRegistry.class.getDeclaredField("traits");
			fieldTraits.setAccessible(true);
			Map<String, ITrait> traits=(Map)fieldTraits.get(null);
			traits.forEach((idTrait,trait)->{
				JsonObject jsonTrait=new JsonObject();
				String name=trait.getLocalizedName();
				String desc=trait.getLocalizedDesc();
				boolean isHidden=trait.isHidden();
				int priority=trait.getPriority();

				jsonTrait.addProperty("id",idTrait);
				jsonTrait.addProperty("name",name);
				jsonTrait.addProperty("desc",desc);
				jsonTrait.addProperty("hidden",isHidden);
				jsonTrait.addProperty("priority",priority);

				try
				{
					if(trait instanceof AbstractTrait)
					{
						Field fieldColor=AbstractTrait.class.getDeclaredField("color");
						fieldColor.setAccessible(true);
						int color=(int)fieldColor.get(trait);
						jsonTrait.addProperty("color",Integer.toHexString(color));
					}
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}

				jsonTraits.add(idTrait,jsonTrait);
			});

			base.add("infos",jsonInfo);
			base.add("materials",jsonMaterials);
			base.add("traits",jsonTraits);

			ofs.print(base);
			ofs.flush();
		}
	}

	private static String jsonTic(JsonObject json,IMaterialStats stat)
	{
		String type=null;
		if(stat instanceof HeadMaterialStats)
		{
			HeadMaterialStats head=(HeadMaterialStats)stat;
			json.addProperty("durability",head.durability);
			json.addProperty("attack",head.attack);
			json.addProperty("level",head.harvestLevel);
			json.addProperty("speed",head.miningspeed);
			type="head";
		}
		else if(stat instanceof HandleMaterialStats)
		{
			HandleMaterialStats handle=(HandleMaterialStats)stat;
			json.addProperty("durability",handle.durability);
			json.addProperty("modifier",handle.modifier);
			type="handle";
		}
		else if(stat instanceof ExtraMaterialStats)
		{
			ExtraMaterialStats extra=(ExtraMaterialStats)stat;
			json.addProperty("durability",extra.extraDurability);
			type="extra";
		}
		else if(stat instanceof BowMaterialStats)
		{
			BowMaterialStats bow=(BowMaterialStats)stat;
			json.addProperty("damage",bow.bonusDamage);
			json.addProperty("speed",bow.drawspeed);
			json.addProperty("range",bow.range);
			type="bow";
		}
		else if(stat instanceof BowStringMaterialStats)
		{
			BowStringMaterialStats string=(BowStringMaterialStats)stat;
			json.addProperty("modifier",string.modifier);
			type="string";
		}
		else if(stat instanceof FletchingMaterialStats)
		{
			FletchingMaterialStats fletching=(FletchingMaterialStats)stat;
			json.addProperty("accuracy",fletching.accuracy);
			json.addProperty("modifier",fletching.modifier);
			type="fletching";
		}
		else if(stat instanceof ArrowShaftMaterialStats)
		{
			ArrowShaftMaterialStats shaft=(ArrowShaftMaterialStats)stat;
			json.addProperty("ammo",shaft.bonusAmmo);
			json.addProperty("modifier",shaft.modifier);
			type="shaft";
		}
		return type;
	}
	private static String jsonConarm(JsonObject json,IMaterialStats stat)
	{
		String type=null;
		if(stat instanceof CoreMaterialStats)
		{
			CoreMaterialStats core=(CoreMaterialStats)stat;
			json.addProperty("defense",core.defense);
			json.addProperty("durability",core.durability);
			type="core";
		}
		else if(stat instanceof PlatesMaterialStats)
		{
			PlatesMaterialStats plate=(PlatesMaterialStats)stat;
			json.addProperty("durability",plate.durability);
			json.addProperty("modifier",plate.modifier);
			json.addProperty("toughness",plate.toughness);
			type="plate";
		}
		else if(stat instanceof TrimMaterialStats)
		{
			TrimMaterialStats trim=(TrimMaterialStats)stat;
			json.addProperty("durability",trim.extraDurability);
			type="trim";
		}
		return type;
	}

	static Map<String,String> lang=new HashMap<>();
	static
	{
		// json key -> lang key
		lang.put("Name","web.tic_exporter.name");
		lang.put("HeadDurability","web.tic_exporter.head.durability");
		lang.put("HeadAttack","web.tic_exporter.head.attack");
		lang.put("HeadLevel","web.tic_exporter.head.level");
		lang.put("HeadSpeed","web.tic_exporter.head.speed");
		lang.put("HeadTraits","web.tic_exporter.head.traits");
		lang.put("HandleDurability","web.tic_exporter.handle.durability");
		lang.put("HandleModifier","web.tic_exporter.handle.modifier");
		lang.put("HandleTraits","web.tic_exporter.handle.traits");
		lang.put("ExtraDurability","web.tic_exporter.extra.durability");
		lang.put("ExtraTraits","web.tic_exporter.extra.traits");
		lang.put("BowAttack","web.tic_exporter.bow.attack");
		lang.put("BowRange","web.tic_exporter.bow.range");
		lang.put("BowSpeed","web.tic_exporter.bow.speed");
		lang.put("BowTraits","web.tic_exporter.bow.traits");
		lang.put("StringModifier","web.tic_exporter.string.modifier");
		lang.put("StringTraits","web.tic_exporter.string.traits");
		lang.put("FletchingAccuracy","web.tic_exporter.fletching.accuracy");
		lang.put("FletchingModifier","web.tic_exporter.fletching.modifier");
		lang.put("FletchingTraits","web.tic_exporter.fletching.traits");
		lang.put("ShaftModifier","web.tic_exporter.shaft.modifier");
		lang.put("ShaftAmmo","web.tic_exporter.shaft.ammo");
		lang.put("ShaftTraits","web.tic_exporter.shaft.traits");
		lang.put("CoreDefense","web.tic_exporter.core.defense");
		lang.put("CoreDurability","web.tic_exporter.core.durability");
		lang.put("CoreTraits","web.tic_exporter.core.traits");
		lang.put("PlateDurability","web.tic_exporter.plate.durability");
		lang.put("PlateToughness","web.tic_exporter.plate.toughness");
		lang.put("PlateModifier","web.tic_exporter.plate.modifier");
		lang.put("PlateTraits","web.tic_exporter.plate.traits");
		lang.put("TrimDurability","web.tic_exporter.trim.durability");
		lang.put("TrimTraits","web.tic_exporter.trim.traits");

		lang.put("Include","web.tic_exporter.include");
		lang.put("Exclude","web.tic_exporter.exclude");
		lang.put("FullEqual","web.tic_exporter.full_equal");
		lang.put("NonEqual","web.tic_exporter.non_equal");
		lang.put("AddFilter","web.tic_exporter.add_filter");
		lang.put("RemoveFilters","web.tic_exporter.remove_filters");
		lang.put("NoFilters","web.tic_exporter.no_filters");
		lang.put("Filt","web.tic_exporter.filt");
		lang.put("ListFilters","web.tic_exporter.list_filters");
		lang.put("BackToTop","web.tic_exporter.back_to_top");

		lang.put("QuickSwitch","web.tic_exporter.quick_switch");
		lang.put("ExperimentalFeatures","web.tic_exporter.experimental_features");
		lang.put("EnableThen","web.tic_exporter.enable_then");
		lang.put("Enable","web.tic_exporter.enable");
		lang.put("AllMaterials","web.tic_exporter.all_materials");
		lang.put("AllTraits","web.tic_exporter.all_traits");
		lang.put("Search","web.tic_exporter.page_search");
		lang.put("Data","web.tic_exporter.page_data");
		lang.put("Compare","web.tic_exporter.page_compare");
		lang.put("About","web.tic_exporter.page_about");
		lang.put("CloseAll","web.tic_exporter.close_all");
		lang.put("OpenAll","web.tic_exporter.open_all");
		lang.put("NothingToDisplay","web.tic_exporter.nothing_to_display");
		lang.put("ExperimentalFeaturesWarning","web.tic_exporter.experimental_features_warning");

		lang.put("DataSource","web.tic_exporter.data_source");
		lang.put("Local","web.tic_exporter.local");
		lang.put("DataSourceEnvironment","web.tic_exporter.data_source_environment");
		lang.put("DataSourceCreateTime","web.tic_exporter.data_source_create_time");
		lang.put("DataSourceInformation","web.tic_exporter.data_source_information");

		lang.put("Intro1","web.tic_exporter.intro_1");
		lang.put("Intro2","web.tic_exporter.intro_2");
		lang.put("Intro3","web.tic_exporter.intro_3");
		lang.put("Intro4","web.tic_exporter.intro_4");
		lang.put("Intro5","web.tic_exporter.intro_5");

		lang.put("Durability","web.tic_exporter.durability");
		lang.put("MiningLevel","web.tic_exporter.mining_level");
		lang.put("MiningSpeed","web.tic_exporter.mining_speed");
		lang.put("Attack","web.tic_exporter.attack");
		lang.put("Speed","web.tic_exporter.speed");
		lang.put("Range","web.tic_exporter.range");
		lang.put("Modifier","web.tic_exporter.modifier");
		lang.put("Accuracy","web.tic_exporter.accuracy");
		lang.put("Ammo","web.tic_exporter.ammo");
		lang.put("Defense","web.tic_exporter.defense");
		lang.put("Toughness","web.tic_exporter.toughness");

		lang.put("Head","web.tic_exporter.head");
		lang.put("Handle","web.tic_exporter.handle");
		lang.put("Extra","web.tic_exporter.extra");
		lang.put("String","web.tic_exporter.string");
		lang.put("Fletching","web.tic_exporter.fletching");
		lang.put("Bow","web.tic_exporter.bow");
		lang.put("Shaft","web.tic_exporter.shaft");
		lang.put("Core","web.tic_exporter.core");
		lang.put("Plate","web.tic_exporter.plate");
		lang.put("Trim","web.tic_exporter.trim");
	}


	private static void exportLangJs(String parent,String name) throws Exception
	{
		File file=new File(parent,name);
		try(PrintStream ofs=new PrintStream(file,"utf-8"))
		{
			ofs.println("const lang={");

			for(Map.Entry<String,String> entry:lang.entrySet())
			{
				String jsonKey=entry.getKey();
				String langKey=entry.getValue();
				String jsonValue;

				if(I18n.canTranslate(langKey))
				{
					jsonValue=I18n.translateToLocal(langKey);
				}
				else
				{
					jsonValue=I18n.translateToFallback(langKey);
				}

				ofs.printf("    %s : `%s`,\n",jsonKey,jsonValue);
			}

			ofs.println("}");

			ofs.flush();
		}
	}
}

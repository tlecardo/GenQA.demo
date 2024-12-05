import AtomicHistory from "../components/elements/AtomicHistory";
import { PopulateStorage } from "../assets/js/tools/populateStorage";
import { Row, Container, Col } from "react-bootstrap";

import { useContext } from 'react';
import AppContext from "../context/AppContext";

function History() {

  const { state } = useContext(AppContext);
  
  let pop = new PopulateStorage()
  // pop.clean()

  return (
    <Container style={{ textAlign: "center" }}>
      <div className="pageTitle">{state.language.historyTitleText()}</div>
      <Row>
        <Col style={{ marginLeft: ".5rem", marginRight: ".5rem", }}>
          <AtomicHistory
            title="Proportion de femmes élues"
            id="ERrhn"
            article="À l’issue du scrutin du 7 novembre, un nombre record de femmes ont été élues à la tête des grandes villes du Québec : Montréal, Longueuil, Gatineau, Sherbrooke et Saguenay ont maintenant une mairesse. Des dizaines d’autres villes de taille moyenne seront, elles aussi, dirigées par des femmes. Selon les résultats encore provisoires du ministère des Affaires municipales et de l’Habitation, pas moins de 239 mairesses et 2420 conseillères municipales ont été élues. Les femmes représentent 23,1 % des maires, 37,9 % des conseillers et 36,1 % des élus municipaux. Cette proportion est en augmentation constante depuis 2005. Dans presque la moitié des conseils municipaux du Québec (48 %), les femmes représentent plus de 40 % des élus, ce qui est dans la zone de parité."
          />
          <AtomicHistory
            title="Nombre de Palestiniens tués depuis le 7 octobre 2023"
            id="hVqxw"
            article="Depuis octobre dernier, près de 35 000 personnes – Israéliens et Palestiniens – ont été tuées; près de 90 000 ont été blessées. Notons que ces données sont préliminaires et que le bilan risque d’être encore plus lourd, notamment en raison des milliers de Palestiniens portés disparus – et présumés morts. Le bilan est presque 30 fois plus lourd du côté palestinien. Depuis janvier, au moins 11 000 Palestiniens auraient été tués, ce qui équivaut à une moyenne de 116 morts par jour."
          />
          <AtomicHistory
            title="Variation des prix au Québec"
            id="8ZGFX"
            article="L’indice des prix à la consommation (IPC) d'une année à l'autre est resté inchangé à 6,9 % en octobre au pays, selon Statistique Canada. Dans sa plus récente publication, l'agence fédérale note qu'un ralentissement observé en octobre de la croissance du prix des aliments a cependant été contrebalancé par une hausse du prix de l'essence et du coût des intérêts hypothécaires. Sur une base mensuelle, l'IPC s'est accru de 0,7 % en octobre, après avoir progressé de 0,1 % en septembre. La hausse est principalement attribuable à la majoration des prix de l'essence. Il s'agit de la hausse mensuelle la plus marquée depuis juin 2022, écrit Statistique Canada dans sa publication Le Quotidien. D'un mois à l'autre, le prix de l'essence a bondi de 9,2 % en octobre au Canada par rapport à septembre. Par rapport à octobre 2021, le prix du litre d'essence se payait 17,8 % plus cher en octobre 2022."
          />
        </Col>
        <Col style={{ marginLeft: ".5rem", marginRight: ".5rem", }}>
          {/* <AtomicHistory
            title="Nombre de déplacées par région"
            id="wHZmu"
            article="Au cours de l’année 2020, un nombre record de personnes ont été déplacées en raison de désastres, selon l’Internal Displacement Monitoring Center (IDMC). L’organisme fait état de 30,7 millions de nouveaux déplacements liés aux catastrophes climatiques et géophysiques, soit trois fois plus que ceux causés par les conflits et la violence (9,8 millions). Les régions les plus problématiques sont l’Asie de l’Est et le Pacifique, ainsi que l’Asie du Sud, en raison de leur vulnérabilité face aux cyclones, aux moussons et aux inondations. Dans ces régions, des millions de personnes vivent dans les deltas, sur les côtes et dans d’autres terres basses propices aux inondations et à l’érosion. Vulnérabilité et densité de population élevée ne font pas bon ménage, souligne Vincent Fung, de l'IDMC."
          /> */}
          <AtomicHistory
            title="Nombre de voitures électriques immatriculées par année au Québec"
            id="RHSrl"
            article="Si, entre 2021 et 2022, le nombre d’automobiles et de camions légers à essence de type promenade avait baissé de 46 385 dans la province, entre 2022 à 2023, la SAAQ note un rebond d’environ 135 000, ce qui donne près de cinq millions d'automobiles à essence sur les routes du Québec. Toutes proportions gardées, le nombre de véhicules électriques augmente plus rapidement, selon ces chiffres qui datent du 31 décembre 2023. Le nombre d’automobiles et de camions légers électriques, à hydrogène et hybrides est passé de 148 862 à 247 025, selon la SAAQ. Le gouvernement du Québec, qui s'est fixé des cibles pour électrifier le parc automobile, attribue cette hausse du nombre d'automobiles sur le réseau routier à la démographie."
          />
          <AtomicHistory
            title="Nombre de déplacements liés au climat"
            id="Q7gAW"
            article="L’Organisation internationale des migrations (OIM) s'inquiète également de l’augmentation de la température dans des zones du monde très chaudes. Près d'un million de personnes vivent déjà dans des régions tropicales et subtropicales où le stress thermique est très fort. Avec la hausse des températures, l’OIM estime que de 30 à 60 millions de personnes se retrouveraient dans des régions où, pendant les mois les plus chauds, l’air ambiant serait trop chaud pour le fonctionnement normal du corps humain. Des migrations importantes sont donc à prévoir. Il est urgent, disent les scientifiques, d’agir dès maintenant, notamment en recueillant des données plus précises sur les événements à évolution lente, comme l’érosion côtière, la hausse du niveau des mers ou la sécheresse, afin de mettre en place des politiques ciblées, dont des relocalisations planifiées. Ça coûte toujours moins cher de prendre des mesures de mitigation [pour réduire la vulnérabilité] plutôt que de devoir s’adapter quand les catastrophes arrivent, observe Robert McLeman."
          />
        </Col>
        <Col style={{ marginLeft: ".5rem", marginRight: ".5rem" }}>
          <AtomicHistory
            title="Évolution du taux directeur de la banque du Canada et de l'IPC"
            id="jYsX2"
            article="L'indice des prix à la consommation (IPC) a progressé de 3,4 % en décembre par rapport à la même période il y a un an. Comme le prévoyaient les économistes, l'IPC a légèrement rebondi : il était de 3,1 % en novembre. Cette accélération de l'inflation en décembre survient après deux mois de relative stabilité de l'IPC à 3,1 % en novembre et en octobre. Cette accélération de l’inflation annuelle le mois dernier est essentiellement attribuable au prix de l’essence qui a augmenté de 1,4 % d’une année à l’autre en décembre alors qu’il affichait un recul de 7,7 % en novembre, explique Statistique Canada. Si on exclut l'essence de l'équation, l'inflation était de + 3,5 % en décembre au Canada, en recul de 0,1 point de pourcentage par rapport à novembre (+ 3,6 %)."
          />
          <AtomicHistory
            title="Interceptions de Cubains à la frontière"
            id="v9KDp"
            article={`Environ 5700 autres personnes ont été arrêtées en mer et retournées à Cuba. C’est sans compter tous ceux qui se sont dirigés ailleurs, que ce soit en Amérique latine ou en Europe, remarque Mariakarla Nodarse Venancio, directrice adjointe pour Cuba au Bureau de Washington sur l'Amérique latine (WOLA), une ONG américaine."On estime qu’environ 300 000 Cubains ont quitté l’île cette année, ce qui représente presque 3 % de la population [de 11,3 millions de personnes]" ne citation de Mariakarla Nodarse Venancio, Bureau de Washington sur l'Amérique latine. Près de 13 000 Cubains ont demandé asile au Mexique depuis janvier, soit 60 % de plus qu’en 2021.`}
          />
          <AtomicHistory
            title="Annual inflation in Canada"
            id="05U1o"
            article={`Canada's annual inflation rate slowed to 2.9 per cent in January, mostly due to a deceleration in the price of gas, Statistics Canada said Tuesday. Economists were expecting the rate to come in at 3.3 per cent. Gas prices fell four per cent year over year in January after driving headline inflation up to 3.4 per cent in December, due to what economists call a base-year effect (the impact of comparing prices in a given month to the same month a year earlier). Excluding gasoline, the consumer price index came in at 3.2 per cent. However, mortgage interest costs continued to be the No. 1 driver of inflation, at a year-over-year rate of 27.4 per cent, while rent price growth ticked up to 7.9 per cent.Environ 5700 autres personnes ont été arrêtées en mer et retournées à Cuba. C’est sans compter tous ceux qui se sont dirigés ailleurs, que ce soit en Amérique latine ou en Europe, remarque Mariakarla Nodarse Venancio, directrice adjointe pour Cuba au Bureau de Washington sur l'Amérique latine (WOLA), une ONG américaine."On estime qu’environ 300 000 Cubains ont quitté l’île cette année, ce qui représente presque 3 % de la population [de 11,3 millions de personnes]" ne citation de Mariakarla Nodarse Venancio, Bureau de Washington sur l'Amérique latine. Près de 13 000 Cubains ont demandé asile au Mexique depuis janvier, soit 60 % de plus qu’en 2021.`}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default History;
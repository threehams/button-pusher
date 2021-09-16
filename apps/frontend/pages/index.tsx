import { Accordion, AccordionItem, Notification } from "@botnet/ui";
import React from "react";

export const Index = () => {
  return (
    <div className="flex flex-row flex-nowrap">
      <aside className="w-56">
        <Accordion title="Hacking">
          <AccordionItem>Terminal</AccordionItem>
          <AccordionItem>Create Script</AccordionItem>
          <AccordionItem>Active Scripts</AccordionItem>
          <AccordionItem>
            <div className="flex items-center justify-between">
              Create Program <Notification>4</Notification>
            </div>
          </AccordionItem>
        </Accordion>
        <Accordion title="Character">
          <AccordionItem>Stats</AccordionItem>
          <AccordionItem>
            <div className="flex items-center justify-between">
              Factions <Notification>2</Notification>
            </div>
          </AccordionItem>
          <AccordionItem>
            <div className="flex items-center justify-between">
              Augmentations <Notification>12</Notification>
            </div>
          </AccordionItem>
          <AccordionItem>Hacknet</AccordionItem>
        </Accordion>
        <Accordion title="World">
          <AccordionItem>City</AccordionItem>
          <AccordionItem>Travel</AccordionItem>
          <AccordionItem>Corp</AccordionItem>
        </Accordion>
        <Accordion title="Help">
          <AccordionItem>Milestones</AccordionItem>
          <AccordionItem>Tutorial</AccordionItem>
        </Accordion>
      </aside>
      <main className="pl-4">
        <div>
          <div>auto.js: hacked: galactic-cyber</div>
          <div>auto.js: hacked: titan-labs</div>
          <div>auto.js: hacked: taiyang-digital</div>
          <div>auto.js: hacked: defcomm</div>
          <div>auto.js: hacked: infocomm</div>
          <div>auto.js: hacked: icarus</div>
          <div>auto.js: hacked: omnia</div>
          <div>auto.js: hacked: The-Cave</div>
          <div>auto.js: hacked: blade</div>
          <div>auto.js: hacked: powerhouse-fitness</div>
          <div>auto.js: hacked: stormtech</div>
          <div>[home ~/]&gt; run join-factions.js</div>
          <div>
            This machine does not have enough RAM to run this script with 1
            threads. Script requires 50.35GB of RAM
          </div>
          <div>[home ~/]&gt; ps</div>
          <div>(PID - 1) auto.js -g -h</div>
          <div>(PID - 879247) single-grow.js taiyang-digital</div>
          <div>(PID - 886127) single-hack.js stormtech</div>
          <div>(PID - 888628) single-hack.js omnia</div>
          <div>[home ~/]&gt; run join-factions.js</div>
          <div>
            This machine does not have enough RAM to run this script with 1
            threads. Script requires 50.35GB of RAM
          </div>
          <div>[home ~/]&gt; run join-factions.js</div>
          <div>
            This machine does not have enough RAM to run this script with 1
            threads. Script requires 50.35GB of RAM
          </div>
          <div>[home ~/]&gt; run join-factions.js</div>
          <div>
            This machine does not have enough RAM to run this script with 1
            threads. Script requires 50.35GB of RAM
          </div>
          <div>[home ~/]&gt; run join-factions.js</div>
          <div>
            This machine does not have enough RAM to run this script with 1
            threads. Script requires 50.35GB of RAM
          </div>
          <div>[home ~/]&gt; run join-factions.js</div>
          <div>Running script with 1 thread(s), pid 892612 and args: [].</div>
          <div>join-factions.js: Joined faction: CyberSec</div>
          <div>auto.js: hacked: b-and-a</div>
          <div>join-factions.js: Joined faction: NiteSec</div>
          <div>join-factions.js: Joined faction: The Black Hand</div>
          <div>join-factions.js: Joined faction: BitRunners</div>
          <div>join-factions.js: Joined faction: Netburners</div>
          <div>join-factions.js: Joined faction: Tian Di Hui</div>
          <div>join-factions.js: Joined faction: Sector-12</div>
          <div>auto.js: hacked: omnitek</div>
          <div>auto.js: hacked: nwo</div>
          <div>auto.js: hacked: megacorp</div>
          <div>auto.js: hacked: ecorp</div>
          <div>auto.js: hacked: kuai-gong</div>
          <div>auto.js: hacked: fulcrumtech</div>
          <div>auto.js: hacked: 4sigma</div>
          <div>
            [home ~/]&gt; <input className="bg-black"></input>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

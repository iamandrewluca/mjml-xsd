import { writeFileSync } from "fs";
import { exec } from "child_process";
import dedent from "dedent";
import dependencies from "./dependencies.js";

let map = new Map();

function generateType(component) {
	let children = dependencies[component] ?? [];

	let xsd =
		children.length === 0
			? dedent`
					<xsd:simpleContent>
						<xsd:extension base="xsd:string" />
					</xsd:simpleContent>
			  `
			: dedent`
					<xsd:sequence minOccurs="0" maxOccurs="unbounded">
						${children
							.map(
								(child) => dedent`
                  <xsd:element name="${child}" type="${child}-type" minOccurs="0" maxOccurs="unbounded" />
                `,
							)
							.join("\n")}
					</xsd:sequence>
			  `;

	map.set(
		component,
		dedent`
      <xsd:complexType name="${component}-type">
          ${xsd}
      </xsd:complexType>
    `,
	);

	children.map((child) => generateType(child));
}

generateType("mjml");

let schema = dedent`
	<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
		<xsd:element name="mjml" type="mjml-type" />
		
		${[...map.values()].join("\n\n")}
	</xsd:schema>
`;

writeFileSync("mjml.xsd", schema);
exec("npm run format");

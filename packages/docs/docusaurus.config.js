/** @type {import('@docusaurus/types').DocusaurusConfig} */

/**
 * 
 * @author Abhinav Shah
 */
module.exports = {
  title: 'xr3ngine',
  tagline: 'An end-to-end solution for hosting humans and AI in a virtual space, built on top of react, three.js and express/feathers.',
  url: 'https://xr3ngine.github.io',
  baseUrl: '/xr3ngine/tree/dev/packages/docs/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://github.com/xr3ngine/xr3ngine/raw/dev/xrengine%20black.png',
  organizationName: 'xr3ngine', // Usually your GitHub org/user name.
  projectName: 'xr3ngine', // Usually your repo name.
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        id:'api-1',
        entryPoints: [
                        '../client-core',
                     ],
        exclude: '../client-core/components/ui/InteractableModal',
        tsconfig: '../client-core/tsconfig.json',
        exclude: [
            '**/node_modules/**'
        ],
        out: 'docs-client-core',
        readme: 'none',
        sidebar: {
           sidebarFile: 'sidebar/typedoc-client-core.js',
        }
      },
    ],
    [
        'docusaurus-plugin-typedoc',
        {
          id:'api-2',
          entryPoints: [
                          '../client'
                       ],
          tsconfig: '../client/tsconfig.json',
          exclude: [
              '**/node_modules/**'
          ],
          out: 'docs-client',
          readme: 'none',
          sidebar: {
             sidebarFile: 'sidebar/typedoc-client.js',
          }
        },
      ],
      [
          'docusaurus-plugin-typedoc',
          {
            id:'api-3',
            entryPoints: [
                            '../server'
                         ],
            tsconfig: '../server/tsconfig.json',
            exclude: [
                '**/node_modules/**',         
            ],
            out: 'docs-server',
            readme: 'none',
            sidebar: {
               sidebarFile: 'sidebar/typedoc-server.js',
            }
          },
        ],
      [
        'docusaurus-plugin-typedoc',
        {
          id:'api-4',
          entryPoints: [
                          '../common'
                       ],
          tsconfig: '../common/tsconfig.json',
          exclude: [
              '**/node_modules/**',         
          ],
          out: 'docs-common',
          readme: 'none',
          sidebar: {
             sidebarFile: 'sidebar/typedoc-common.js',
          }
        },
      ],
      // [
      //   'docusaurus-plugin-typedoc',
      //   {
      //     id:'api-9',
      //     entryPoints: [
      //                     '../engine/src/'
      //                  ],
      //     tsconfig: '../engine/tsconfig.typedoc.json',
      //     exclude: [
      //         '**/node_modules/**', 
      //         '**/csm/**'        
      //     ],
      //     out: 'docs-engine',
      //     readme: 'none',
      //     sidebar: {
      //        sidebarFile: 'sidebar/typedoc-engine.js',
      //     }
      //   },
      // ],
      [
          'docusaurus-plugin-typedoc',
          {
            id:'api-5',
            entryPoints: [
                            '../gameserver/src/'
                         ],
            tsconfig: '../gameserver/tsconfig.json',
            exclude: [
                '**/node_modules/**',       
            ],
            out: 'docs-gameserver',
            readme: 'none',
            sidebar: {
               sidebarFile: 'sidebar/typedoc-gameserver.js',
            }
          },
        ],
      [
        'docusaurus-plugin-typedoc',
        {
          id:'api-7',
          entryPoints: [
                          '../native-plugin-xr/src/'
                       ],
          tsconfig: '../native-plugin-xr/tsconfig.json',
          exclude: [
              '**/node_modules/**',       
          ],
          out: 'docs-native-plugin-xr',
          readme: 'none',
          sidebar: {
             sidebarFile: 'sidebar/typedoc-native-plugin-xr.js',
          }
        },
      ],
      [
        'docusaurus-plugin-typedoc',
        {
          id:'api-8',
          entryPoints: [
                          '../server-core/src/'
                       ],
          tsconfig: '../server-core/tsconfig.json',
          exclude: [
              '**/node_modules/**',       
          ],
          out: 'docs-server-core',
          readme: 'none',
          sidebar: {
             sidebarFile: 'sidebar/typedoc-server-core.js',
          }
        },
      ],
  ],
  themeConfig: {
    navbar: {
      // title: 'xr3ngine',
      logo: {
        alt: 'Logo',
        src: 'https://github.com/xr3ngine/xr3ngine/raw/dev/xrengine%20black.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/xr3ngine/xr3ngine',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/doc1/',
            },
            {
              label: 'Installation',
              to: 'docs/doc2/',
            },
            {
              label: 'Deployment',
              to: 'docs/doc3/',
            },
            {
              label: 'Configurations',
              to: 'docs/doc4/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/mQ3D4FE',
            },
            {
              label: 'Github',
              href: 'https://github.com/xr3ngine/xr3ngine',
            }
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} THEOVERLAY, Inc. Built with LAGUNA LABS.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/xr3ngine/xr3ngine/edit/jsdoc/packages/docs/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
         customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

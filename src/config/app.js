const config = {
  // baseUrl: 'http://localhost:57350/api/',
  baseUrl: 'http://10.194.51.14:3001/FOL/api/',

  inputMenu: [
    {
      item: '1.0 Total Sales',
      subItem: [
        '1.0 Total Sales', 
        '1.1 Gross Sales - External', 
        '1.2 Gross Sales - Interco', 
        '1.3 Gross Sales - Recoveries', 
        '1.4 Rev Recog - OT Contract',
        '1.5 Rev Reversal - OT Contract'
      ]
    },
    {
      item: '2.0 MCOS',
      subItem: [
        '2.0 MCOS',
        '2.1 Std VAM % from Ops',
        '2.2 MCOS Recoveries',
        '2.3 COGS Recog - OT Contract',
        '2.4 COGS Reversal - OT Contract'
      ]
    },
    {
      item: '3.0 Material Margin',
      subItem: [
        '3.0 Material Margin',
        '3.1 PPV',
        '3.2 FCP-PPV',
        '3.3 Alloc-PPV',
        '3.4 FCP_Alloc BPC Working'
      ]
    },
    {
      item: '4.1 Material Loss',
      subItem: [
        '4.1 Material Loss',
        '4.2 Freight in',
        '4.3 Freight out',
        '4.4 EDM',
        '4.5 MCOSO',
        '4.6 Subcontract',
        '4.7 Inv. Reserve'
      ]
    },
    {
      item: '5.1 DL',
      subItem: [
        '5.1 DL'
      ]
    },
    {
      item: '6.0 Total MOH',
      subItem: [
        '6.0 Total MOH',
        '6.1 IDL',
        '6.2 Depn',
        '6.3 FUS.',
        '6.4 MOHO',
        '6.5 OEUP',
        '6.6 ELEC'
      ]
    },
    {
      item: '7.0 Total SG&A',
      subItem: [
        '7.0 Total SG&A',
        '7.1 G.A.',
        '7.2 S.M.'
      ]
    },
    {
      item: '8.0 Corp. Alloc.',
      subItem: [
        '8.0 Corp. Alloc.'
      ]
    },
    {
      item: '9.0 Other Costs',
      subItem: [
        '9.0 Other Costs'
      ]
    },
    {
      item: '10.0 Change of CLOH',
      subItem: [
        '10.0 Change of CLOH',
        '10.1 CLOH Recog OT',
        '10.2 CLOH Reversal OT'
      ]
    },
  ]
}

export {
  config
};
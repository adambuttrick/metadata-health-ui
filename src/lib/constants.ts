export type FieldCategory = 'mandatory' | 'recommended' | 'optional';

export interface SubfieldMetadata {
  displayLabel: string;
  description: string;
  url: string;
}

export interface FieldMetadata {
  category: FieldCategory;
  displayLabel: string;
  summary: string;
  url: string;
  subfields?: Record<string, SubfieldMetadata>;
}

export const METADATA_FIELDS: Record<string, FieldMetadata> = {
  // Mandatory Fields
  'identifier': {
    category: 'mandatory',
    displayLabel: 'Identifier',
    summary: "The Identifier is a unique string that identifies a resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/identifier/",
    subfields: {
      'identifierType': {
        displayLabel: 'Identifier Type',
        description: 'The type of identifier.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/identifier/#identifiertype'
      }
    }
  },
  'creators': {
    category: 'mandatory',
    displayLabel: 'Creators',
    summary: "The main researchers involved in producing the data, or the authors of the publication.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/",
    subfields: {
      'nameType': {
        displayLabel: 'Name Type',
        description: 'The type of name for the creator.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/#creatornametype'
      },
      'nameIdentifier': {
        displayLabel: 'Name Identifier',
        description: 'Unique identifier for the creator.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/#creatornameidentifier'
      },
      'nameIdentifierScheme': {
        displayLabel: 'Name Identifier Scheme',
        description: 'The name of the name identifier scheme.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/#a-nameidentifierscheme'
      },
      'affiliation': {
        displayLabel: 'Affiliation',
        description: 'The organizational or institutional affiliation of the creator.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/#a-affiliationidentifier'
      },
      'affiliationIdentifier': {
        displayLabel: 'Affiliation Identifier',
        description: 'Unique identifier for the affiliation of the creator.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/#a-affiliationidentifier'
      },
      'affiliationIdentifierScheme': {
        displayLabel: 'Affiliation Identifier Scheme',
        description: 'The name of the affiliation identifier scheme',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/creator/#b-affiliationidentifierscheme'
      }
    }
  },
  'titles': {
    category: 'mandatory',
    displayLabel: 'Titles',
    summary: "A name or title by which a resource is known.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/title/"
  },
  'publisher': {
    category: 'mandatory',
    displayLabel: 'Publisher',
    summary: "The name of the entity that holds, archives, publishes, prints, distributes, releases, issues, or produces the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/publisher/"
  },
  'publicationYear': {
    category: 'mandatory',
    displayLabel: 'Publication Year',
    summary: "The year when the data was or will be made publicly available.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/publicationyear/"
  },
  // Recommended Fields
  'resourceType': {
    category: 'recommended',
    displayLabel: 'Resource Type',
    summary: "A description of the resource type.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/resourcetype/",
    subfields: {
      'resourceTypeGeneral': {
        displayLabel: 'Resource Type General',
        description: 'The general type of the resource.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/resourcetype/#resourcetypegeneral'
      }
    }
  },
  'subject': {
    category: 'recommended',
    displayLabel: 'Subject',
    summary: "Subject, keyword, classification code, or key phrase describing the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/subject/"
  },
  'contributors': {
    category: 'recommended',
    displayLabel: 'Contributors',
    summary: "The institution or person responsible for collecting, managing, distributing, or otherwise contributing to the development of the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/",
    subfields: {
      'contributorType': {
        displayLabel: 'Contributor Type',
        description: 'The type of contributor of the resource.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#contributortype'
      },
      'nameType': {
        displayLabel: 'Name Type',
        description: 'The type of name for the contributor.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#contributornametype'
      },
      'nameIdentifier': {
        displayLabel: 'Name Identifier',
        description: 'Unique identifier for the contributor.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#contributornameidentifier'
      },
      'nameIdentifierScheme': {
        displayLabel: 'Name Identifier Scheme',
        description: 'The name of the name identifier scheme.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#a-nameidentifierscheme'
      },
      'affiliation': {
        displayLabel: 'Affiliation',
        description: 'The organizational or institutional affiliation of the contributor.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#a-affiliationidentifier'
      },
      'affiliationIdentifier': {
        displayLabel: 'Affiliation Identifier',
        description: 'Unique identifier for the affiliation of the contributor.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#a-affiliationidentifier'
      },
      'affiliationIdentifierScheme': {
        displayLabel: 'Affiliation Identifier Scheme',
        description: 'The name of the affiliation identifier scheme',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/contributor/#b-affiliationidentifierscheme'
      }
    }
  },
  'date': {
    category: 'recommended',
    displayLabel: 'Date',
    summary: "Different dates relevant to the work.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/date/"
  },
  'language': {
    category: 'recommended',
    displayLabel: 'Language',
    summary: "The primary language of the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/language/"
  },
  // Optional Fields
  'alternateIdentifiers': {
    category: 'optional',
    displayLabel: 'Alternate Identifiers',
    summary: "An identifier or identifiers other than the primary Identifier applied to the resource being registered.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/alternateidentifier/"
  },
  'relatedIdentifiers': {
    category: 'optional',
    displayLabel: 'Related Identifiers',
    summary: "Identifiers of related resources. These must be globally unique identifiers.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/relatedidentifier/",
    subfields: {
      'relationType': {
        displayLabel: 'Relation Type',
        description: 'Description of the relationship between the resource and the related resource.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/relatedidentifier/#relationtype'
      },
      'relatedIdentifierType': {
        displayLabel: 'Related IdentifierType',
        description: 'The type of the Related Identifier.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/relatedidentifier/#a-relatedidentifiertype'
      },
      'resourceTypeGeneral': {
        displayLabel: 'Resource Type General',
        description: 'The general type of the related resource.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/relatedidentifier/#f-resourcetypegeneral'
      }
    }
  },
  'relatedItems': {
    category: 'optional',
    displayLabel: 'Related Items',
    summary: "Information about a resource related to the one being registered.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/relateditem/"
  },
  'size': {
    category: 'optional',
    displayLabel: 'Size',
    summary: "Unstructured size information about the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/size/"
  },
  'format': {
    category: 'optional',
    displayLabel: 'Format',
    summary: "Technical format of the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/format/"
  },
  'version': {
    category: 'optional',
    displayLabel: 'Version',
    summary: "The version number of the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/version/"
  },
  'rights': {
    category: 'optional',
    displayLabel: 'Rights',
    summary: "Information about rights held in and over the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/rights/"
  },
  'description': {
    category: 'optional',
    displayLabel: 'Description',
    summary: "All additional information that does not fit in any of the other categories.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/description/"
  },
  'geoLocations': {
    category: 'optional',
    displayLabel: 'Geographic Locations',
    summary: "Spatial region or named place where the data was gathered or about which the data is focused.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/geolocation/"
  },
  'fundingReferences': {
    category: 'optional',
    displayLabel: 'Funding References',
    summary: "Information about financial support for the resource being registered.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/",
    subfields: {
      'funderName': {
        displayLabel: 'Funder Name',
        description: 'Name of the funding provider.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/#fundername'
      },
      'funderIdentifier': {
        displayLabel: 'Funder Identifier',
        description: 'Unique identifier for the funding provider.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/#funderidentifier'
      },
      'funderIdentifierType': {
        displayLabel: 'Funder Identifier Type',
        description: 'Type of the funder identifier.',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/#funderidentifiertype'
      },
      'awardNumber': {
        displayLabel: 'Award Number',
        description: 'The code assigned by the funder to a sponsored award (grant).',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/#awardnumber'
      },
      'awardURI': {
        displayLabel: 'Award URI',
        description: 'The URI leading to a page provided by the funder for more information about the award (grant).',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/#awarduri'
      },
      'awardTitle': {
        displayLabel: 'Award Title',
        description: 'The human readable title or name of the award (grant).',
        url: 'https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/fundingreference/#awardtitle'
      }
    }
  },
  'subjects': {
    category: 'recommended',
    displayLabel: 'Subjects',
    summary: "Subject, keyword, classification code, or key phrase describing the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/subject/"
  },
  'sizes': {
    category: 'optional',
    displayLabel: 'Sizes',
    summary: "Unstructured size information about the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/size/"
  },
  'formats': {
    category: 'optional',
    displayLabel: 'Formats',
    summary: "Technical format of the resource.",
    url: "https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/format/"
  }
};

export const RESOURCE_TYPES = {
  Audiovisual: 'Audiovisual',
  Book: 'Book',
  BookChapter: 'Book Chapter',
  Collection: 'Collection',
  ComputationalNotebook: 'Computational Notebook',
  ConferencePaper: 'Conference Paper',
  ConferenceProceeding: 'Conference Proceeding',
  DataPaper: 'Data Paper',
  Dataset: 'Dataset',
  Dissertation: 'Dissertation',
  Event: 'Event',
  Image: 'Image',
  InteractiveResource: 'Interactive Resource',
  Journal: 'Journal',
  JournalArticle: 'Journal Article',
  Model: 'Model',
  OutputManagementPlan: 'Output Management Plan',
  PeerReview: 'Peer Review',
  PhysicalObject: 'Physical Object',
  Preprint: 'Preprint',
  Report: 'Report',
  Service: 'Service',
  Software: 'Software',
  Sound: 'Sound',
  Standard: 'Standard',
  Text: 'Text',
  Workflow: 'Workflow',
  Other: 'Other'
} as const;

export type ResourceType = keyof typeof RESOURCE_TYPES;

export const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
  Audiovisual: '#FF6B6B',      // Coral Red
  Book: '#4ECDC4',            // Turquoise
  BookChapter: '#45B7D1',     // Light Blue
  Collection: '#96CEB4',      // Sage Green
  ComputationalNotebook: '#9D94FF', // Periwinkle
  ConferencePaper: '#FFD93D',  // Golden Yellow
  ConferenceProceeding: '#F4D03F', // Darker Yellow
  DataPaper: '#FF9F43',       // Orange
  Dataset: '#4A90E2',         // Blue
  Dissertation: '#D35400',    // Burnt Orange
  Event: '#A569BD',           // Purple
  Image: '#26A69A',           // Teal
  InteractiveResource: '#FF5252', // Red
  Journal: '#78909C',         // Blue Grey
  JournalArticle: '#90A4AE',  // Lighter Blue Grey
  Model: '#81C784',           // Green
  OutputManagementPlan: '#7986CB', // Indigo
  PeerReview: '#B39DDB',      // Light Purple
  PhysicalObject: '#2ECC71',   // Emerald Green
  Preprint: '#F06292',        // Pink
  Report: '#95A5A6',          // Grey
  Service: '#AED581',         // Light Green
  Software: '#E74C3C',        // Red
  Sound: '#FFA726',           // Light Orange
  Standard: '#BA68C8',        // Purple
  Text: '#F5D76E',           // Light Yellow
  Workflow: '#4DB6AC',        // Light Teal
  Other: '#BDC3C7'           // Light Grey
};

export const getTextColor = (status: FieldCategory | string, completeness: number): string => {
  if (status === 'optional') {
    return 'text-gray-700';
  }
  return getCompletenessColor(completeness, true);
};

export const getCategoryColor = (status: FieldCategory | string, completeness: number): string => {
  if (status === 'optional') {
    return 'bg-gray-500';
  }
  return getCompletenessColor(completeness, false);
};

export const getCompletenessColor = (completeness: number, isText: boolean = false): string => {
  if (completeness >= 0.7) return isText ? 'text-[#0E8C73]' : 'bg-[#0E8C73]';
  if (completeness >= 0.4) return isText ? 'text-[#C65911]' : 'bg-[#C65911]';
  return isText ? 'text-[#D14B1F]' : 'bg-[#D14B1F]';
};

export function getResourceTypeColor(type: string): string {
  return type in RESOURCE_TYPE_COLORS 
    ? RESOURCE_TYPE_COLORS[type as ResourceType] 
    : RESOURCE_TYPE_COLORS.Other;
}

export function getFieldsByCategory(category: FieldCategory): string[] {
  return Object.entries(METADATA_FIELDS)
    .filter(([, metadata]) => metadata.category === category)
    .map(([field]) => field);
}

export function getFieldDescription(field: string): string {
  return METADATA_FIELDS[field]?.summary || "Additional metadata field for the resource";
}

export function getFieldUrl(field: string): string | undefined {
  return METADATA_FIELDS[field]?.url;
}

export function getFieldCategory(field: string): FieldCategory | undefined {
  return METADATA_FIELDS[field]?.category;
}

export function getFieldDisplayLabel(field: string): string {
  console.log('Getting display label for field:', field);
  console.log('Metadata exists:', !!METADATA_FIELDS[field]);
  
  const metadata = METADATA_FIELDS[field];
  return metadata?.displayLabel || field;
}

export function getSubfieldDisplayLabel(field: string, subfield: string): string {
  return METADATA_FIELDS[field]?.subfields?.[subfield]?.displayLabel || 
    subfield.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function getSubfieldDescription(field: string, subfield: string): string {
  return METADATA_FIELDS[field]?.subfields?.[subfield]?.description || 
    'Additional metadata subfield';
}

export function getSubfieldUrl(field: string, subfield: string): string | undefined {
  return METADATA_FIELDS[field]?.subfields?.[subfield]?.url;
}

export function getValueDescription(fieldName: string, subfieldName: string, value: string): string | null {
  const descriptions: Record<string, Record<string, Record<string, string>>> = {
    creators: {
      nameType: {
        Personal: "Individual person who contributed to the creation of the resource",
        Organizational: "Organization that contributed to the creation of the resource",
        Unknown: "Creator type could not be determined"
      }
    },
    titles: {
      titleType: {
        AlternativeTitle: "A secondary or alternative title for the resource",
        Subtitle: "A secondary, usually more detailed title",
        TranslatedTitle: "The title translated into another language",
        Other: "Other type of title not covered by the other categories"
      }
    },
    relatedIdentifiers: {
      relationType: {
        References: "This resource references the target resource",
        IsReferencedBy: "This resource is referenced by the target resource",
        IsSupplementTo: "This resource supplements the target resource",
        IsSupplementedBy: "This resource is supplemented by the target resource",
        IsCitedBy: "This resource is cited by the target resource",
        Cites: "This resource cites the target resource"
      }
    }
  };

  return descriptions[fieldName]?.[subfieldName]?.[value] || null;
}

export const FIELD_CATEGORIES: FieldCategory[] = ['mandatory', 'recommended', 'optional'];

export const CATEGORY_LABELS: Record<FieldCategory, string> = {
  mandatory: 'Mandatory Fields',
  recommended: 'Recommended Fields',
  optional: 'Optional Fields'
};

export const ERROR_MESSAGES = {
  ORGANIZATION: {
    LOAD_FAILED: 'Unable to load organization details. Please try again later or contact support if the problem persists.',
    NOT_FOUND: 'Organization not found. Please check the URL and try again.',
    TITLE: 'Unable to Load Organization'
  },
  REPOSITORY: {
    LOAD_FAILED: (failedCount: number, successCount: number) => 
      `Unable to load data for ${failedCount} ${
        failedCount === 1 ? 'repository' : 'repositories'
      }. Displaying information for ${successCount} available ${
        successCount === 1 ? 'repository' : 'repositories'
      }.`,
    FAILED_ITEM: (id: string) => `Failed to load repository: ${id}`,
    NOT_FOUND: (id: string) => `Repository "${id}" is not available. Showing organization overview instead.`,
    TITLE: 'Some Repository Data Unavailable'
  }
} as const;

export const STATUS_COLORS = {
  mandatory: {
    text: 'text-[#0E8C73]',
    bg: 'bg-[#0E8C73]',
    provider: {
      text: 'text-[#0E8C73]',
      bg: 'bg-[#0E8C73]'
    },
    client: {
      text: 'text-[#0D7A64]',
      bg: 'bg-[#0D7A64]'
    },
    unknown: {
      text: 'text-[#0E8C73]',
      bg: 'bg-[#0E8C73]'
    }
  },
  recommended: {
    text: 'text-[#C65911]',
    bg: 'bg-[#C65911]',
    provider: {
      text: 'text-[#C65911]',
      bg: 'bg-[#C65911]'
    },
    client: {
      text: 'text-[#B54E0F]',
      bg: 'bg-[#B54E0F]'
    },
    unknown: {
      text: 'text-[#C65911]',
      bg: 'bg-[#C65911]'
    }
  },
  optional: {
    text: 'text-gray-700',
    bg: 'bg-gray-500',
    provider: {
      text: 'text-gray-700',
      bg: 'bg-gray-500'
    },
    client: {
      text: 'text-gray-600',
      bg: 'bg-gray-400'
    },
    unknown: {
      text: 'text-gray-700',
      bg: 'bg-gray-500'
    }
  }
} as const;
